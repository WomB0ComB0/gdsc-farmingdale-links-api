# syntax=docker/dockerfile:1

# Bun-based Dockerfile for GDSC Farmingdale Links API

ARG BUN_VERSION=latest

################################################################################
# Base stage with Bun runtime
FROM oven/bun:${BUN_VERSION}-alpine AS base

WORKDIR /app

################################################################################
# Install dependencies
FROM base AS deps

# Copy lockfile and package.json for dependency installation
COPY package.json bun.lock ./

# Install production dependencies only
RUN bun install --frozen-lockfile --production

################################################################################
# Build stage
FROM base AS build

COPY package.json bun.lock ./

# Install all dependencies (including dev) for building
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the application (outputs to ./server executable)
RUN bun run build

################################################################################
# Production stage
FROM base AS final

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 app && \
  adduser --system --uid 1001 --ingroup app app

USER app

# Copy production dependencies
COPY --from=deps --chown=app:app /app/node_modules ./node_modules

# Copy built application (compiled executable)
COPY --from=build --chown=app:app /app/server ./server

# Copy public folder for static assets
COPY --from=build --chown=app:app /app/public ./public

# Copy data folder
COPY --from=build --chown=app:app /app/data ./data

# Copy package.json for runtime
COPY --chown=app:app package.json ./

EXPOSE 3000

CMD ["./server"]
