if [[ "$VERCEL_GIT_COMMIT_MESSAGE" != \[PROD\]* ]]; then
  echo "Skipping deploy: commit doesn't start with [PROD]"
  exit 0
fi
