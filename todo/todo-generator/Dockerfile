FROM curlimages/curl:latest

COPY generate-todo.sh /generate-todo.sh

USER root
RUN chmod +x /generate-todo.sh
USER curl_user

CMD ["/generate-todo.sh"]