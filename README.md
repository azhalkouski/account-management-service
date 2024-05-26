# account-management-service

### TypeScript requirement for zod.
According to this
https://www.npmjs.com/package/zod#installation
The tsconfig.json must contain
`"compilerOptions": {
    // ...
    "strict": true
  }`, and that is the only zod's requirement for typescript.