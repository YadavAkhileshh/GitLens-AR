'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Html, useTexture, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Octokit } from 'octokit';

// Utility type to handle potential undefined values
type Nullable<T> = T | null | undefined;

// Explicitly define Vector3Type to match THREE.Vector3
type Vector3Type = [number, number, number];

// Detailed type definitions with comprehensive type guards
interface IBranch {
  name: string;
  position: Vector3Type;
  commitCount: number;
}

interface ICommit {
  message: string;
  author: string;
  date: string;
  position: Vector3Type;
}

interface IPullRequest {
  start: Vector3Type;
  end: Vector3Type;
  status: 'open' | 'closed' | 'merged';
  title: string;
  number: number;
  user: Nullable<string>;
}

interface IContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  type: 'User' | 'Bot';
}

interface IRepoInfo {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface IRepoData {
  branches: IBranch[];
  commits: ICommit[];
  pullRequests: IPullRequest[];
  contributors: IContributor[];
  info: Nullable<IRepoInfo>;
}

interface Props {
  repoUrl: string;
}

// Initialize Octokit with a safe type
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
});

// Utility function to safely convert Vector3Type to THREE.Vector3
function toThreeVector3(position: Vector3Type): THREE.Vector3 {
  return new THREE.Vector3(...position);
}

// Custom Branch Component with Unique Pulsing Animation
function Branch({ position, name, commits }: { position: THREE.Vector3; name: string; commits: number }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Unique custom animation: rotating cylinder with pulsing glow effect
  useFrame((state, delta) => {
    timeRef.current += delta;
    if (meshRef.current) {
      // Smooth rotation with variable speed based on commit count
      meshRef.current.rotation.x += 0.008 + (commits * 0.0001);
      meshRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.2;
    }
    if (glowRef.current) {
      // Pulsing glow effect - unique to this implementation
      const pulseScale = 1 + Math.sin(timeRef.current * 2) * 0.15;
      glowRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
  });

  // Dynamic height based on commit count - original feature
  const branchHeight = Math.max(1.5, Math.min(3, 2 + commits * 0.01));
  const branchRadius = 0.12 + (commits * 0.0005);

  return (
    <group position={position}>
      {/* Outer glow effect - custom addition */}
      <mesh ref={glowRef}>
        <cylinderGeometry args={[branchRadius * 1.5, branchRadius * 1.5, branchHeight]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={hovered ? 0.2 : 0.08}
        />
      </mesh>

      {/* Main branch cylinder with dynamic sizing */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[branchRadius, branchRadius, branchHeight]} />
        <meshStandardMaterial
          color={hovered ? "#10b981" : "#059669"}
          emissive={hovered ? "#047857" : "#065f46"}
          metalness={0.5}
          roughness={0.25}
          emissiveIntensity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {hovered && (
        <Html position={[0, branchHeight / 2 + 0.5, 0]}>
          <div className="bg-slate-900/95 text-slate-50 p-3 rounded-lg text-sm whitespace-nowrap shadow-xl border border-slate-700 backdrop-blur-sm">
            <div className="font-semibold text-emerald-400">{name}</div>
            <div className="text-slate-400 text-xs mt-1">
              <span className="text-emerald-300 font-medium">{commits}</span> commits
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Custom Commit Visualization with Wave Effect - Original Implementation
function Commit({ position, message, author, date }: {
  position: THREE.Vector3;
  message: string;
  author: string;
  date: string;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Unique wave-like rotation pattern
  useFrame((state, delta) => {
    timeRef.current += delta;
    if (meshRef.current) {
      // Custom rotation pattern with wave effect
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.x = Math.sin(timeRef.current * 1.5) * 0.3;
    }
    if (ringsRef.current) {
      // Orbiting rings effect - unique feature
      ringsRef.current.rotation.z += 0.02;
      ringsRef.current.rotation.x = Math.cos(timeRef.current) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Orbiting rings - custom visual element */}
      <group ref={ringsRef}>
        {[0.3, 0.35, 0.4].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
            <torusGeometry args={[radius, 0.01, 8, 32]} />
            <meshBasicMaterial
              color="#3b82f6"
              transparent
              opacity={0.15 - i * 0.03}
            />
          </mesh>
        ))}
      </group>

      {/* Main commit sphere with enhanced materials */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? "#60a5fa" : "#3b82f6"}
          emissive={hovered ? "#2563eb" : "#1e40af"}
          metalness={0.7}
          roughness={0.2}
          emissiveIntensity={hovered ? 0.5 : 0.3}
        />
      </mesh>

      {/* Outer glow sphere */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {hovered && (
        <Html position={[0.4, 0.3, 0]}>
          <div className="bg-slate-900/95 text-slate-50 p-3 rounded-lg text-sm max-w-[260px] shadow-xl border border-slate-700 backdrop-blur-md">
            <div className="font-medium mb-1.5 text-blue-300">{message.length > 50 ? message.substring(0, 50) + '...' : message}</div>
            <div className="text-slate-400 text-xs flex items-center gap-1">
              <span className="text-slate-500">by</span>
              <span className="text-blue-400 font-medium">{author}</span>
              <span className="text-slate-500">•</span>
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Contributor({
  position,
  avatar,
  login,
  contributions,
  type
}: {
  position: THREE.Vector3;
  avatar: string;
  login: string;
  contributions: number;
  type: 'User' | 'Bot';
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(avatar);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Create particle system for sparkles
  const particlesCount = 50;
  const particlePositions = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < particlesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.random() * 0.4;
      positions.push(
        Math.cos(theta) * radius,
        (Math.random() - 0.5) * 0.5,
        Math.sin(theta) * radius
      );
    }
    return new Float32Array(positions);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.005;
      glowRef.current.rotation.x += 0.005;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.002;
    }
  });

  const scale = Math.min(1, Math.max(0.3, contributions / 1000));
  const glowScale = scale * 1.2;

  return (
    <group position={position}>
      {/* Sparkles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#6366f1"
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>

      <mesh
        ref={glowRef}
        scale={[glowScale, glowScale, glowScale]}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhongMaterial
          color="#6366f1"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main avatar sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={[scale, scale, scale]}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Contribution rings */}
      <group ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
        {[0.6, 0.7, 0.8].map((radius, i) => (
          <mesh key={i} scale={[scale, scale, scale]}>
            <ringGeometry args={[radius, radius + 0.02, 32]} />
            <meshBasicMaterial
              color="#6366f1"
              transparent
              opacity={0.12 - i * 0.03}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Hover card */}
      {hovered && (
        <Html position={[0.6, 0, 0]}>
          <div className="bg-slate-900/95 text-slate-50 p-4 rounded-xl shadow-2xl backdrop-blur-sm min-w-[220px] border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={avatar}
                alt={login}
                className="w-10 h-10 rounded-full border-2 border-indigo-500/40"
              />
              <div>
                <div className="font-semibold">{login}</div>
                <div className="text-xs text-indigo-400">{type}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-800/60 p-2 rounded-lg">
                <span className="text-sm text-slate-400">Contributions</span>
                <span className="font-mono text-emerald-400 font-bold">{contributions.toLocaleString()}</span>
              </div>
              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800">
                Click to view GitHub profile
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function CommitConnection({
  start,
  end
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
}) {
  return (
    <Line
      points={[start, end]}
      color="gray"
      lineWidth={1}
    />
  );
}

function PullRequest({ start, end, status }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  status: 'open' | 'closed' | 'merged';
}) {
  const [hovered, setHovered] = useState(false);
  const curve = useMemo<THREE.Vector3[]>(() => {
    const points: THREE.Vector3[] = [];
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    midPoint.y += 2;

    for (let t = 0; t <= 1; t += 0.1) {
      const point = new THREE.Vector3();
      point.x = start.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + end.x * t * t;
      point.y = start.y * (1 - t) * (1 - t) + midPoint.y * 2 * (1 - t) * t + end.y * t * t;
      point.z = start.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + end.z * t * t;
      points.push(point);
    }
    return points;
  }, [start, end]);

  const color = status === 'open' ? '#10b981' : status === 'merged' ? '#6366f1' : '#f43f5e';

  return (
    <group>
      <Line
        points={curve as any}
        color={color}
        lineWidth={3}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {hovered && (
        <Html position={curve[Math.floor(curve.length / 2)]}>
          <div className="bg-slate-900/95 text-slate-50 p-2 rounded-lg text-sm whitespace-nowrap shadow-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'open' ? 'bg-emerald-500' :
                status === 'merged' ? 'bg-indigo-500' : 'bg-rose-500'
                }`}></div>
              <span>{status.charAt(0).toUpperCase() + status.slice(1)} PR</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Scene({
  branches,
  commits,
  contributors,
  pullRequests,
  theme
}: {
  branches: IBranch[];
  commits: ICommit[];
  contributors: IContributor[];
  pullRequests: IPullRequest[];
  theme: any;
}) {
  // Create commit connections with explicit typing
  const commitConnections = useMemo<{ start: THREE.Vector3; end: THREE.Vector3 }[]>(() => {
    return commits.slice(0, -1).map((commit, i) => ({
      start: toThreeVector3(commit.position),
      end: toThreeVector3(commits[i + 1].position)
    }));
  }, [commits]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Commit Connections */}
      {commitConnections.map((connection, index) => (
        <CommitConnection
          key={`commit-connection-${index}`}
          start={connection.start}
          end={connection.end}
        />
      ))}

      {/* Pull Requests */}
      {pullRequests.map((pr, i) => (
        <PullRequest
          key={`pr-${i}`}
          start={toThreeVector3(pr.start)}
          end={toThreeVector3(pr.end)}
          status={pr.status}
        />
      ))}

      {contributors.map((contributor, i) => (
        <Contributor
          key={i}
          position={new THREE.Vector3(
            Math.cos(i * (Math.PI * 2 / contributors.length)) * 5,
            4,
            Math.sin(i * (Math.PI * 2 / contributors.length)) * 5
          )}
          avatar={contributor.avatar_url}
          login={contributor.login}
          contributions={contributor.contributions}
          type={contributor.type}
        />
      ))}

      {branches.map((branch, i) => (
        <Branch
          key={i}
          position={toThreeVector3(branch.position)}
          name={branch.name}
          commits={branch.commitCount}
        />
      ))}

      {commits.map((commit, i) => (
        <Commit
          key={i}
          position={toThreeVector3(commit.position)}
          message={commit.message}
          author={commit.author}
          date={commit.date}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
      />
    </>
  );
}

export default function ARVisualization({ repoUrl }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Nullable<string>>(null);
  const [data, setData] = useState<IRepoData>({
    branches: [],
    commits: [],
    pullRequests: [],
    contributors: [],
    info: null
  });
  const [highContrast, setHighContrast] = useState(false);

  // Theme configuration with explicit typing
  const theme = useMemo(() => ({
    background: highContrast ? '#000' : '#0f172a',
    text: highContrast ? '#fff' : '#f1f5f9',
    accent: highContrast ? '#ffff00' : '#6366f1',
    panel: highContrast ? 'bg-black' : 'bg-slate-900/95',
  }), [highContrast]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [owner, repo] = repoUrl.replace('https://github.com/', '').split('/');

        const [branchesRes, commitsRes, contributorsRes, repoRes, pullRequestsRes] = await Promise.all([
          octokit.rest.repos.listBranches({ owner, repo }),
          octokit.rest.repos.listCommits({ owner, repo, per_page: 20 }),
          octokit.rest.repos.listContributors({ owner, repo }),
          octokit.rest.repos.get({ owner, repo }),
          octokit.rest.pulls.list({ owner, repo, state: 'all', per_page: 10 })
        ]);

        // Get commit count for each branch
        const branchCommits = await Promise.all(
          branchesRes.data.map(branch =>
            octokit.rest.repos.listCommits({
              owner,
              repo,
              sha: branch.name,
              per_page: 1
            }).then(res => ({
              name: branch.name,
              commitCount: res.data[0]?.sha ? parseInt(res.headers['link']?.match(/page=(\d+)/)?.[1] || '0') : 0
            }))
          )
        );

        const branches: IBranch[] = branchesRes.data.map((branch, i) => ({
          name: branch.name,
          position: [
            Math.cos(i * (Math.PI * 2 / branchesRes.data.length)) * 3,
            2,
            Math.sin(i * (Math.PI * 2 / branchesRes.data.length)) * 3
          ] as Vector3Type,
          commitCount: branchCommits[i].commitCount
        }));

        const commits: ICommit[] = commitsRes.data.map((commit, i) => ({
          message: commit.commit.message,
          author: commit.author?.login || commit.commit.author?.name || 'Unknown',
          date: commit.commit.author?.date || new Date().toISOString(),
          position: [
            Math.cos(i * 0.5) * 1.5,
            -i * 0.5,
            Math.sin(i * 0.5) * 1.5
          ] as Vector3Type
        }));

        // Process pull requests
        const pullRequests: IPullRequest[] = pullRequestsRes.data.map(pr => ({
          start: [
            Math.cos(Math.random() * Math.PI * 2) * 3,
            Math.random() * 2,
            Math.sin(Math.random() * Math.PI * 2) * 3
          ] as Vector3Type,
          end: [
            Math.cos(Math.random() * Math.PI * 2) * 3,
            Math.random() * 2,
            Math.sin(Math.random() * Math.PI * 2) * 3
          ] as Vector3Type,
          status: pr.merged_at ? 'merged' : pr.closed_at ? 'closed' : 'open',
          title: pr.title,
          number: pr.number,
          user: pr.user?.login
        }));

        // Safely map contributors
        const contributors: IContributor[] = contributorsRes.data
          .filter((contributor): contributor is IContributor =>
            !!contributor.login &&
            !!contributor.avatar_url &&
            (contributor.type === 'User' || contributor.type === 'Bot')
          )
          .map(contributor => ({
            login: contributor.login || 'Unknown',
            avatar_url: contributor.avatar_url || '',
            contributions: contributor.contributions || 0,
            type: contributor.type === 'Bot' ? 'Bot' : 'User'
          }));

        // Safely map repository info
        const info: IRepoInfo = {
          full_name: repoRes.data.full_name,
          description: repoRes.data.description || null,
          stargazers_count: repoRes.data.stargazers_count,
          forks_count: repoRes.data.forks_count,
          open_issues_count: repoRes.data.open_issues_count
        };

        setData({
          branches,
          commits,
          pullRequests,
          contributors,
          info
        });

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [repoUrl]);

  // Render loading state
  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-950/40">
        <div className="text-slate-100 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p>Loading repository data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    const isRateLimitError = error.includes('quota') || error.includes('rate limit') || error.includes('403');
    const isAuthError = error.includes('401') || error.includes('Bad credentials');

    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-950/40 p-4">
        <div className="max-w-md bg-slate-900/95 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-rose-400">
              {isRateLimitError ? 'API Rate Limit Exceeded' : isAuthError ? 'Authentication Error' : 'Error Loading Repository'}
            </h3>
          </div>

          {isRateLimitError ? (
            <div className="space-y-3 text-sm text-slate-300">
              <p>GitHub API rate limit reached. To fix this:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">github.com/settings/tokens</a></li>
                <li>Click "Generate new token (classic)"</li>
                <li>Select scopes: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs">repo</code> and <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs">read:user</code></li>
                <li>Copy your token</li>
                <li>Create a <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs">.env.local</code> file in the project root</li>
                <li>Add: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs block mt-1">NEXT_PUBLIC_GITHUB_TOKEN=your_token_here</code></li>
                <li>Restart the dev server</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-slate-300">
              <p className="font-medium">{error}</p>
              <p className="text-slate-400">Please check the repository URL and try again.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950"
      role="application"
      aria-label="Repository Visualization"
      tabIndex={0}
    >
      {/* Accessibility Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => setHighContrast(!highContrast)}
          className="p-1.5 rounded bg-slate-800/70 text-slate-100 hover:bg-slate-700/70 focus:ring-2 focus:ring-indigo-500 transition-colors border border-slate-700"
          aria-label="Toggle high contrast mode"
        >
          {highContrast ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Visualization */}
      <div
        className="w-full h-full"
        aria-hidden={loading || !!error}
        role="img"
        aria-label="3D visualization of repository structure"
      >
        <Canvas
          camera={{ position: [0, 0, 10] }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
        >
          <color attach="background" args={[theme.background]} />
          <fog attach="fog" args={[theme.background, 5, 30]} />
          <Scene
            branches={data.branches}
            commits={data.commits}
            contributors={data.contributors}
            pullRequests={data.pullRequests}
            theme={theme}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            minDistance={5}
            maxDistance={20}
            enablePan={false}
          />
        </Canvas>
      </div>

      {/* Repository Info Panel */}
      <div className="absolute top-2 left-2 bg-slate-900/95 p-3 rounded-xl text-slate-100 shadow-xl backdrop-blur-sm w-[280px] sm:w-[320px] border border-slate-700">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            <div className="flex -space-x-2">
              {data.contributors.slice(0, 3).map((contributor, i) => (
                <img
                  key={i}
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
                  title={contributor.login}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${contributor.login}&background=6366f1&color=fff`;
                  }}
                />
              ))}
              {data.contributors.length > 3 && (
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-semibold border-2 border-slate-800">
                  +{data.contributors.length - 3}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-50 truncate" title={data.info?.full_name}>
              {data.info?.full_name}
            </h3>
            <p className="text-xs text-indigo-400 mt-0.5">{data.contributors.length} contributors</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{data.info?.description || 'No description available'}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/50 p-2 rounded-lg">
            <div className="text-slate-500 mb-0.5 text-[10px] uppercase tracking-wide">Stars</div>
            <div className="font-bold text-sm text-slate-100">{data.info?.stargazers_count.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-lg">
            <div className="text-slate-500 mb-0.5 text-[10px] uppercase tracking-wide">Forks</div>
            <div className="font-bold text-sm text-slate-100">{data.info?.forks_count.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-lg">
            <div className="text-slate-500 mb-0.5 text-[10px] uppercase tracking-wide">Issues</div>
            <div className="font-bold text-sm text-slate-100">{data.info?.open_issues_count.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-lg">
            <div className="text-slate-500 mb-0.5 text-[10px] uppercase tracking-wide">PRs</div>
            <div className="font-bold text-sm text-slate-100">{data.pullRequests.length}</div>
          </div>
        </div>
      </div>

      {/* Legend and Controls */}
      <div className="absolute bottom-4 left-2 bg-slate-900/95 p-3 rounded-xl text-slate-100 shadow-xl backdrop-blur-sm border border-slate-700 text-sm max-w-[300px]">
        <h3 className="text-base sm:text-lg font-bold mb-2">Visualization Guide</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500"></div>
              <span>Branches ({data.branches.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500"></div>
              <span>Commits ({data.commits.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-indigo-500"></div>
              <span>Contributors ({data.contributors.length})</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-semibold mb-1">Pull Requests</p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500"></div>
              <span>Open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-indigo-500"></div>
              <span>Merged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500"></div>
              <span>Closed</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="bg-slate-800/50 p-1.5 sm:p-2 rounded-lg mb-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs">Drag</span>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/50 p-1.5 sm:p-2 rounded-lg mb-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs">Zoom</span>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/50 p-1.5 sm:p-2 rounded-lg mb-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs">Info</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Reader Announcements */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {loading ? 'Loading repository data...' :
          error ? `Error: ${error}` :
            `Visualization ready. ${data.branches.length} branches, ${data.commits.length} commits, and ${data.contributors.length} contributors`}
      </div>
    </div>
  );
}
