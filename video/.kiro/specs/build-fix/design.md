# Design Document

## Overview

This design addresses three TypeScript compilation errors preventing the video platform backend from building successfully. The solution involves installing missing type definitions for the UUID library and correcting the JWT token signing implementation to match the correct type signature expected by the jsonwebtoken library.

## Architecture

The fix operates at the build-time layer of the application:

```
┌─────────────────────────────────────────┐
│         TypeScript Source Code          │
│  - auth.service.ts (JWT signing)        │
│  - storage.service.ts (UUID usage)      │
│  - local-storage.service.ts (UUID)      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      TypeScript Compiler (tsc)          │
│  - Type checking                        │
│  - Type definitions resolution          │
│  - Code generation                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Compiled JavaScript Output         │
│           (dist/ directory)             │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Package Dependencies

**Current State:**
- `uuid` package is installed in dependencies
- `@types/uuid` is missing from devDependencies
- `@types/jsonwebtoken` is installed but JWT usage has type errors

**Required Changes:**
- Add `@types/uuid` to devDependencies

### 2. Auth Service (auth.service.ts)

**Current Implementation (Line 82):**
```typescript
return jwt.sign(payload, config.jwtSecret, {
  expiresIn: config.jwtExpiresIn,
});
```

**Issue:**
The TypeScript compiler cannot match this call to any of the jwt.sign overloads because:
- The `config.jwtSecret` is typed as `string` (from `process.env.JWT_SECRET || 'default'`)
- The `config.jwtExpiresIn` is typed as `string` (from `process.env.JWT_EXPIRES_IN || '24h'`)
- TypeScript is having trouble inferring which overload to use

**Solution Approach:**
Explicitly type the parameters or use type assertions to help TypeScript match the correct overload signature.

### 3. Storage Services (storage.service.ts, local-storage.service.ts)

**Current Implementation:**
```typescript
import { v4 as uuidv4 } from 'uuid';
```

**Issue:**
TypeScript cannot find type definitions for the 'uuid' module, resulting in implicit 'any' type.

**Solution:**
Install `@types/uuid` package to provide type definitions.

## Data Models

No data model changes required. This is purely a build-time type resolution fix.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Since this is a build-time fix addressing specific compilation errors rather than runtime behavior, the correctness properties are expressed as concrete examples that verify the build succeeds:

**Example 1: Build command succeeds**
The build command `npm run build` should complete with exit code 0 and produce no TypeScript compilation errors.
**Validates: Requirements 1.1, 1.3, 1.4**

**Example 2: UUID type definitions resolve**
The TypeScript compiler should successfully resolve type definitions for UUID imports in both `storage.service.ts` and `local-storage.service.ts` without TS7016 errors.
**Validates: Requirements 2.1, 2.2, 2.4**

**Example 3: Package.json contains UUID types**
The `package.json` file should include `@types/uuid` in the devDependencies section.
**Validates: Requirements 2.3**

**Example 4: JWT signing compiles without errors**
The `jwt.sign()` call in `auth.service.ts` line 82 should compile without TS2769 overload matching errors.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

**Example 5: Compiled output exists**
After successful compilation, the `dist/` directory should contain valid JavaScript files corresponding to the TypeScript source files.
**Validates: Requirements 1.2**

## Error Handling

### Build Errors

**Error Type:** Missing type definitions
- **Detection:** TypeScript compiler error TS7016
- **Resolution:** Install `@types/uuid` package
- **Prevention:** Ensure all JavaScript libraries have corresponding @types packages installed

**Error Type:** Type signature mismatch
- **Detection:** TypeScript compiler error TS2769
- **Resolution:** Ensure parameters passed to jwt.sign match expected types
- **Prevention:** Use explicit type annotations or type assertions when needed

### Validation

After applying fixes:
1. Run `npm run build` to verify compilation succeeds
2. Check exit code is 0
3. Verify dist/ directory contains compiled JavaScript
4. Confirm no TypeScript errors in output

## Testing Strategy

### Unit Testing

Since this is a build-time fix, traditional unit tests are not applicable. Instead, we verify correctness through:

1. **Build Verification Test**: Execute `npm run build` and verify exit code 0
2. **File Existence Test**: Verify compiled JavaScript files exist in dist/
3. **Package Dependency Test**: Verify @types/uuid is in package.json devDependencies

### Integration Testing

1. **Full Build Pipeline**: Run the complete build process as it would run in CI/CD
2. **Docker Build Test**: Verify the Dockerfile build succeeds with the fixes applied
3. **Production Deployment Simulation**: Test that the build artifacts can be deployed

### Manual Verification Steps

1. Run `npm run build` locally
2. Inspect TypeScript compiler output for errors
3. Check that dist/ directory is populated
4. Verify the application starts with `npm start`
5. Test authentication endpoints to ensure JWT functionality works

## Implementation Notes

### Fix Priority

1. **High Priority**: Install @types/uuid (quick fix, no code changes)
2. **High Priority**: Fix JWT signing type error (requires code modification)

### JWT Fix Options

**Option 1: Type Assertion**
```typescript
return jwt.sign(payload, config.jwtSecret as string, {
  expiresIn: config.jwtExpiresIn,
} as jwt.SignOptions);
```

**Option 2: Explicit Typing in Config**
```typescript
jwtSecret: process.env.JWT_SECRET as string || 'your-secret-key',
jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '24h') as string,
```

**Option 3: Type Guard**
```typescript
const secret: jwt.Secret = config.jwtSecret;
const options: jwt.SignOptions = {
  expiresIn: config.jwtExpiresIn,
};
return jwt.sign(payload, secret, options);
```

**Recommended:** Option 1 is simplest and most direct for this use case.

### Deployment Considerations

- These fixes must be applied before any production deployment
- The Dockerfile already includes the build step, so fixing local build will fix Docker build
- No runtime behavior changes - purely compile-time fixes
- No database migrations or data changes required
