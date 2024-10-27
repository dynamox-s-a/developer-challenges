FROM nginx:mainline-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY cors.conf /etc/nginx/cors.conf
COPY proxy_params.conf /etc/nginx/proxy_params.conf

WORKDIR /var/www/html

RUN chown -R nginx:nginx /var/www/html && chmod -R 755 /var/www/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx