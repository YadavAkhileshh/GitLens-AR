'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Html, useTexture, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
});

interface Props {
  repoUrl: string;
}

type Vector3 = [number, number, number];

interface RepoData {
  branches: Branch[];
  commits: Commit[];
  pullRequests: PullRequest[];
  contributors: Contributor[];
  info: RepoInfo | null;
}

interface Branch {
  name: string;
  position: Vector3;
  commitCount: number;
}

interface Commit {
  message: string;
  author: string;
  date: string;
  position: Vector3;
}

interface PullRequest {
  start: Vector3;
  end: Vector3;
  status: 'merged' | 'closed' | 'open';
  title: string;
  number: number;
  user: string;
}

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

interface RepoInfo {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

function Branch({ position, name, commits }: { position: THREE.Vector3; name: string; commits: number }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.1, 0.1, 2]} />
        <meshStandardMaterial 
          color={hovered ? "#00ff00" : "#008000"}
          emissive={hovered ? "#00ff00" : "#004000"}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {hovered && (
        <Html position={[0, 1, 0]}>
          <div className="bg-black/80 text-white p-2 rounded-lg text-sm whitespace-nowrap">
            <div>Branch: {name}</div>
            <div>Commits: {commits}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Commit({ position, message, author, date }: { 
  position: THREE.Vector3; 
  message: string; 
  author: string;
  date: string;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial 
          color={hovered ? "#4169e1" : "#0000ff"}
          emissive={hovered ? "#4169e1" : "#00008b"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {hovered && (
        <Html position={[0.3, 0.3, 0]}>
          <div className="bg-black/80 text-white p-2 rounded-lg text-sm max-w-[200px]">
            <div className="font-semibold">{message}</div>
            <div className="text-gray-300 text-xs mt-1">
              by {author} • {new Date(date).toLocaleDateString()}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Contributor({ position, avatar, login, contributions }: { 
  position: THREE.Vector3; 
  avatar: string;
  login: string;
  contributions: number;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(avatar);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Create particle system for sparkles
  const particlesCount = 50;
  const particlePositions = useMemo(() => {
    const positions = [];
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

  useFrame((state) => {
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
          color="#4a9eff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      <mesh
        ref={glowRef}
        scale={[glowScale, glowScale, glowScale]}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhongMaterial
          color="#4a9eff"
          transparent
          opacity={0.15}
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
              color="#4a9eff"
              transparent
              opacity={0.15 - i * 0.03}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Hover card */}
      {hovered && (
        <Html position={[0.6, 0, 0]}>
          <div className="bg-black/90 text-white p-4 rounded-xl shadow-xl backdrop-blur-sm min-w-[200px] border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={avatar} 
                alt={login}
                className="w-10 h-10 rounded-full border-2 border-blue-500/30"
              />
              <div>
                <div className="font-semibold">{login}</div>
                <div className="text-xs text-blue-400">Top Contributor</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                <span className="text-sm text-gray-300">Contributions</span>
                <span className="font-mono text-green-400 font-bold">{contributions.toLocaleString()}</span>
              </div>
              <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
                Click to view GitHub profile
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function PullRequest({ start, end, status }: { 
  start: THREE.Vector3;
  end: THREE.Vector3;
  status: 'open' | 'closed' | 'merged';
}) {
  const [hovered, setHovered] = useState(false);
  const curve = useMemo(() => {
    const points = [];
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

  const color = status === 'open' ? '#28a745' : status === 'merged' ? '#6f42c1' : '#cb2431';

  return (
    <group>
      <Line
        points={curve}
        color={color}
        lineWidth={3}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {hovered && (
        <Html position={curve[Math.floor(curve.length / 2)]}>
          <div className="bg-black/80 text-white p-2 rounded-lg text-sm whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                status === 'open' ? 'bg-green-500' : 
                status === 'merged' ? 'bg-purple-500' : 'bg-red-500'
              }`}></div>
              <span>{status.charAt(0).toUpperCase() + status.slice(1)} PR</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function CommitConnection({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  return (
    <Line
      points={[start, end]}
      color="#4a5568"
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}

function Scene({ 
  branches, 
  commits, 
  contributors,
  pullRequests,
  theme
}: { 
  branches: Branch[]; 
  commits: Commit[];
  contributors: Contributor[];
  pullRequests: PullRequest[];
  theme: any;
}) {
  // Create commit connections
  const commitConnections = useMemo(() => {
    const connections = [];
    for (let i = 0; i < commits.length - 1; i++) {
      connections.push({
        start: new THREE.Vector3(...commits[i].position),
        end: new THREE.Vector3(...commits[i + 1].position)
      });
    }
    return connections;
  }, [commits]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Commit Connections */}
      {commitConnections.map((connection, i) => (
        <CommitConnection key={`connection-${i}`} start={connection.start} end={connection.end} />
      ))}

      {/* Pull Requests */}
      {pullRequests.map((pr, i) => (
        <PullRequest
          key={`pr-${i}`}
          start={new THREE.Vector3(...pr.start)}
          end={new THREE.Vector3(...pr.end)}
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
        />
      ))}

      {branches.map((branch, i) => (
        <Branch 
          key={i} 
          position={new THREE.Vector3(...branch.position)} 
          name={branch.name}
          commits={branch.commitCount}
        />
      ))}

      {commits.map((commit, i) => (
        <Commit 
          key={i} 
          position={new THREE.Vector3(...commit.position)}
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
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RepoData>({
    branches: [],
    commits: [],
    pullRequests: [],
    contributors: [],
    info: null
  });
  const [highContrast, setHighContrast] = useState(false);

  // Theme configuration
  const theme = {
    background: highContrast ? '#000' : '#1a1a1a',
    text: highContrast ? '#fff' : '#e0e0e0',
    accent: highContrast ? '#ffff00' : '#7c3aed',
    panel: highContrast ? 'bg-black' : 'bg-black/90',
  };

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

        const branches = branchesRes.data.map((branch, i) => ({
          name: branch.name,
          position: [
            Math.cos(i * (Math.PI * 2 / branchesRes.data.length)) * 3,
            2,
            Math.sin(i * (Math.PI * 2 / branchesRes.data.length)) * 3
          ],
          commitCount: branchCommits[i].commitCount
        }));

        const commits = commitsRes.data.map((commit, i) => ({
          message: commit.commit.message,
          author: commit.author?.login || commit.commit.author?.name || 'Unknown',
          date: commit.commit.author?.date,
          position: [
            Math.cos(i * 0.5) * 1.5,
            -i * 0.5,
            Math.sin(i * 0.5) * 1.5
          ]
        }));

        // Process pull requests
        const pullRequests = pullRequestsRes.data.map(pr => ({
          start: [
            Math.cos(Math.random() * Math.PI * 2) * 3,
            Math.random() * 2,
            Math.sin(Math.random() * Math.PI * 2) * 3
          ],
          end: [
            Math.cos(Math.random() * Math.PI * 2) * 3,
            Math.random() * 2,
            Math.sin(Math.random() * Math.PI * 2) * 3
          ],
          status: pr.merged_at ? 'merged' : pr.closed_at ? 'closed' : 'open',
          title: pr.title,
          number: pr.number,
          user: pr.user?.login
        }));

        setData({
          branches,
          commits,
          pullRequests,
          contributors: contributorsRes.data,
          info: repoRes.data
        });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [repoUrl]);

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-black/20">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p>Loading repository data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-black/20">
        <div className="text-red-400 text-center p-4">
          <p className="text-xl mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-black"
      role="application"
      aria-label="Repository Visualization"
      tabIndex={0}
    >
      {/* Accessibility Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => setHighContrast(!highContrast)}
          className="p-1.5 rounded bg-black/50 text-white hover:bg-black/70 focus:ring-2 focus:ring-white transition-colors"
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
      <div className="absolute top-2 left-2 bg-black/90 p-2 rounded-xl text-white shadow-xl backdrop-blur-sm max-w-[280px] sm:max-w-[250px] md:max-w-sm border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex -space-x-2">
            {data.contributors.slice(0, 3).map((contributor, i) => (
              <img
                key={i}
                src={contributor.avatar_url}
                alt={contributor.login}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-black/90"
                title={contributor.login}
              />
            ))}
            {data.contributors.length > 3 && (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold border-2 border-black/90">
                +{data.contributors.length - 3}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold truncate">{data.info?.full_name}</h3>
            <p className="text-xs sm:text-sm text-blue-400">{data.contributors.length} contributors</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-300 mb-3 line-clamp-2">{data.info?.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div className="bg-white/5 p-2 rounded-lg">
            <div className="text-gray-400 mb-1">Stars</div>
            <div className="font-bold text-base sm:text-lg">{data.info?.stargazers_count.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 p-2 rounded-lg">
            <div className="text-gray-400 mb-1">Forks</div>
            <div className="font-bold text-base sm:text-lg">{data.info?.forks_count.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 p-2 rounded-lg">
            <div className="text-gray-400 mb-1">Issues</div>
            <div className="font-bold text-base sm:text-lg">{data.info?.open_issues_count.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 p-2 rounded-lg">
            <div className="text-gray-400 mb-1">PRs</div>
            <div className="font-bold text-base sm:text-lg">{data.pullRequests.length}</div>
          </div>
        </div>
      </div>

      {/* Legend and Controls */}
      <div className="absolute bottom-4 left-2 bg-black/90 p-2 rounded-xl text-white shadow-xl backdrop-blur-sm border border-white/10 text-xs sm:text-sm md:text-base max-w-[280px] sm:max-w-[2900px]">
        <h3 className="text-base sm:text-lg font-bold mb-2">Visualization Guide</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
              <span>Branches ({data.branches.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500"></div>
              <span>Commits ({data.commits.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-purple-500"></div>
              <span>Contributors ({data.contributors.length})</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-semibold mb-1">Pull Requests</p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              <span>Open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-purple-500"></div>
              <span>Merged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <span>Closed</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="bg-white/5 p-1.5 sm:p-2 rounded-lg mb-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs">Drag</span>
            </div>
            <div className="text-center">
              <div className="bg-white/5 p-1.5 sm:p-2 rounded-lg mb-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs">Zoom</span>
            </div>
            <div className="text-center">
              <div className="bg-white/5 p-1.5 sm:p-2 rounded-lg mb-1">
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
