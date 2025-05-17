#!/bin/bash
echo "Running tests with Vitest..."
cd "$(dirname "$0")"
npm test
echo ""
echo "To run tests in watch mode, use: npm run test:watch"
echo "To generate a coverage report, use: npm run test:coverage"
