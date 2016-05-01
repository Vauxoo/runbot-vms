Version=0.0.2
---

Our Runbot Instance configuration files for deployments... (No Source here
review the readme)

TODO: MOVE THIS CONFIGURATION STEPS TO ANSIBLE.

How to install runbot_travis2docker module from scratch
---

1. Install docker
2. Create OS "runbot" user.

  ```bash
  useradd -d /home/runbot -m -s /bin/bash -p runbotpwd runbot && usermod -aG docker runbot
  su - runbot
  ```

3. Clone all repositories

  ```bash
  mkdir -p ~/instance
  git clone https://github.com/Vauxoo/runbot-addons.git -b 9.0 ~/instance/runbot-addons
  git clone https://github.com/Vauxoo/odoo-extra.git -b 9.0 ~/instance/odoo-extra
  git clone https://github.com/Vauxoo/runbot.git -b 9.0 ~/instance/odoo-extra
  git clone https://github.com/odoo/odoo.git -b 9.0 ~/instance/odoo
  ```

4. As root install dependencies apt and pip packages

  ```bash
  curl -sL https://deb.nodesource.com/setup | sudo bash -
  apt-get install nodejs nodejs-legacy
  npm install -g less
  npm install -g less-plugin-clean-css
  apt-get install -y python-pip python-dev python-lxml \
      libsasl2-dev libldap2-dev libssl-dev \
      libjpeg-dev \
      python-matplotlib \
      nodejs-legacy \
      python-psycopg2
  sed -i '/lxml/d' /home/runbot/instance/odoo/requirements.txt
  pip install -r /home/runbot/instance/odoo/requirements.txt
  pip install travis2docker simplejson
  npm install -g less-plugin-clean-css

  locale-gen fr_FR \
    && locale-gen en_US.UTF-8 \
    && dpkg-reconfigure locales \
    && update-locale LANG=en_US.UTF-8 \
    && update-locale LC_ALL=en_US.UTF-8 \
    && ln -s /usr/share/i18n/SUPPORTED /var/lib/locales/supported.d/all \
    && locale-gen \
    && echo 'LANG="en_US.UTF-8"' > /etc/default/locale
  ```

5. As root user install and configure postgresql

  ```bash
  apt-get install -y postgresql-9.3 postgresql-contrib-9.3 postgresql-common postgresql-server-dev-9.3
  su - postgres -c "psql -c  \"CREATE ROLE runbot LOGIN PASSWORD 'runbotpwd' SUPERUSER INHERIT CREATEDB CREATEROLE;\""
  
  # Run as runbot user:
  createdb runbot
  ```

6. As runbot user configure odoo and start it

  ```bash
  echo -e "[options]\naddons_path=${HOME}/instance/dependencies/runbot-addons,\n    ${HOME}/instance/dependencies/odoo-extra,\n    ${HOME}/instance/odoo/addons,\n    ${HOME}/instance/odoo/openerp/addons\ndb_name = runbot\ndbfilter = runbot" | tee -a ~/.openerp_serverrc
  ~/instance/odoo/odoo.py -i runbot_travis2docker --without-demo=all
  ```

7. Configure nginx, dns and host

 - Create follow site configuration `/etc/nginx/sites-enabled/site-runbot.conf`

  ```
	upstream runbot {
		server 127.0.0.1:8069 weight=1 max_fails=3 fail_timeout=200m;
	}
	server {
		listen 80;
		server_name runbot.example.com;
		location / {
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header Host $host;
			send_timeout 200m;
			proxy_read_timeout 200m;
			proxy_connect_timeout 200m;
			proxy_pass    http://runbot;
		}
	}

	upstream runbot_instances {
		server 127.0.0.1:8080 weight=1 max_fails=3 fail_timeout=200m;
	}
	server {
		listen 80;
		server_name ~^(.*)\.runbot\.vauxoo\.colima$;
		location / {
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header Host $host;
			send_timeout 200m;
			proxy_read_timeout 200m;
			proxy_connect_timeout 200m;
			proxy_pass    http://runbot_instances;
		}
	}
  ```

  - Restart nginx server to load new site configuration

  ```
  /etc/init.d/nginx restart
  ```

  - Set the dns as hostname

  ```
  runbot.YOUR_DNS_HOST.com > /etc/hostname` or  `hostnamectl set-hostname runbot.YOUR_DNS_HOST.com`
  ```

8. Configure ssh keys

 - Github require  `/home/runbot/.ssh/id_rsa` keys to clone private repositories more info
   [here](https://help.github.com/articles/generating-an-ssh-key/)
 - Add to known hosts git servers

  ```
  ssh-keyscan github.com > ${HOME}/.ssh/known_hosts && ssh-keyscan launchpad.net >> ${HOME}/.ssh/known_hosts && ssh-keyscan bitbucket.org >> ${HOME}/.ssh/known_hosts && ssh-keyscan gitlab.com >> ${HOME}/.ssh/known_hosts
  ```

9. Download the big image for runbot_travis2docker run.

  ```
  docker pull vauxoo/odoo-80-image-shippable-auto` to save time in runbot execution.
  ```

10. Run docker registry server for docker push.

  ```
  docker run --restart=always -d -p 5000:5000 --name registry registry:2
  ```

11. Configure setting of runbot

  - Open in browser http://YOUR_DNS/web and go to menu:settings/runbot and set your values.

12. Configuring your first repository.

  - The repository should look like this one:

  - ![](http://screenshots.vauxoo.com/oem/fc1fe0-1042x619.png)

13. Create your runbot ssh keys.

14. Set your key public in github.

15. Para recuperar una BD y poder trabajar con una BD de producción:

  - Marcar como Disabled todos los repos.
  - Actualizar a un token read todo, y no a un token write.
  - Cambiar los workers.
  - Si es necesaro revisa el puerto start para que sea por encima del puerto en el que estás corriendo Odoo.
  - Cambiar a tu dominio local.
  - Ahora SI puedes activar el cron dentro de cualquier repo para que lance TODOS.

TODO:

  - Notas mentales para Mejoras.
    - job_10_test_base.txt -> docker build
    - job_20_test_all.txt -> docker run
      - Este es: el primer build que tenga El primer build que tenga "TESTS=1" en su dockerfile
    - job_30_test_run.txt -> docker start (keep alive docker de mierda)
  - Con data: https://github.com/vauxoo-dev/runbot_branch_remote_name_grp_feature2
