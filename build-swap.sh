#!/bin/bash

# Repository URL
REPO_URL="https://github.com/tribalized/tribe-swap"

# Directory where the repo will be cloned
CLONE_DIR="swap"

# Build directory where files will be copied
BUILD_DIR="dist"

# Clone the repository
git clone $REPO_URL $CLONE_DIR

# Check if clone was successful
if [ -d "$CLONE_DIR" ]; then
    # Copying files to build directory, excluding index.html
    rsync -av --exclude='service-worker.js' --exclude='asset-manifest.json' --exclude='apple-app-site-association' --exclude='index.html' --exclude='manifest.json' $CLONE_DIR/ $BUILD_DIR/
    cp $CLONE_DIR/index.html $BUILD_DIR/swap.html

    # Optional: Remove the cloned repository directory
    rm -rf $CLONE_DIR

    echo "Repository files (excluding index.html) have been copied to the build directory."
else
    echo "Failed to clone the repository."
fi