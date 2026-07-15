set -e

RANDOM_URL=$(curl -Ls -o /dev/null -w '%{url_effective}' \
  https://en.wikipedia.org/wiki/Special:Random)

curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"Read ${RANDOM_URL}\"}" \
  http://todo-backend-svc:2345/todos