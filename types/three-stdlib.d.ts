// Custom type declaration to fix three-stdlib export issues
declare module 'three-stdlib' {
  export * from './misc/MD2CharacterComplex';
  export * from './misc/ConvexObjectBreaker';
  export * from './misc/MorphBlendMesh';
  export * from './misc/GPUComputationRenderer';
}
