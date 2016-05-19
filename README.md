Version=9.0.0.0.4
---

Our Runbot Instance configuration files for deployments... (No Source here
review the readme)

This installation instructions are to be done inside a blank Ubuntu 14.04
machine it is not pretending to be done in an existent instance.

# Runbot instance with runbot docker based.

1. Install [docker](https://docs.docker.com/engine/installation/linux/ubuntulinux/).
2. Create OS "runbot" user.

  ```bash
  useradd -d /home/runbot -m -s /bin/bash -p runbotpwd runbot && usermod -aG docker runbot
  su - runbot
  ```

3. Clone this repository (it will take a while depending of your internet connection).

  ```bash
  git clone --recursive https://github.com/Vauxoo/runbot -b 9.0 ~/instance
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

5. You can use your own postgres as normal, this step is if you decide install
   runbot in your virtual machine to be separated from your environment.

  a. Inside the same machine from scratch.

    ```bash
    apt-get install -y postgresql-9.3 postgresql-contrib-9.3 postgresql-common postgresql-server-dev-9.3
    su - postgres -c "psql -c  \"CREATE ROLE runbot LOGIN PASSWORD 'runbotpwd' SUPERUSER INHERIT CREATEDB CREATEROLE;\""
    createdb runbot
    ```

6. As runbot user configure odoo and start it

  TODO: Config File should come from a configurator.
  ```bash
  echo -e "[options]\naddons_path=${HOME}/instance/dependencies/runbot-addons,\n    ${HOME}/instance/dependencies/odoo-extra,\n    ${HOME}/instance/odoo/addons,\n    ${HOME}/instance/odoo/openerp/addons\ndb_name = runbot\ndbfilter = runbot" | tee -a ~/.openerp_serverrc
  ```

7. Configure nginx, dns and host

  a. Create follow site configuration 
  `/etc/nginx/sites-enabled/site-runbot.conf`

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

  b. Restart nginx server to load new site configuration

  ```
  /etc/init.d/nginx restart
  ```

  c. Set the dns as hostname

  ```
  runbot.YOUR_DNS_HOST.com > /etc/hostname` or  `hostnamectl set-hostname runbot.YOUR_DNS_HOST.com`
  ```

8. Configure ssh keys

  a.  Github requires  `/home/runbot/.ssh/id_rsa` keys to clone private repositories more info
   [here](https://help.github.com/articles/generating-an-ssh-key/)
  b. Add to known hosts git servers

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

# Running developer mode:.
  
  ```bash
  $ ~/instance/odoo/odoo.py -i runbot_travis2docker --without-demo=all

  ```

# Running as a service mode:.

  - TODO: Running with supervisord.

# To work in an existent db for developers.

  - Mark as disabled all repositories (tip, download a csv and import it
    again).
  - Actualizar a un token read todo, y no a un token write.
  - Cambiar los workers.
  - Si es necesaro revisa el puerto start para que sea por encima del puerto en
    el que estás corriendo Odoo.
  - Cambiar a tu dominio local.
  - Ahora SI puedes activar el cron dentro de cualquier repo para que lance
    TODOS.

Updating from an old version:

# Planned New Features::

  - Notas mentales para Mejoras.
    - job_10_test_base.txt -> docker build
    - job_20_test_all.txt -> docker run
      - Este es: el primer build que tenga El primer build que tenga "TESTS=1" en su dockerfile
    - job_30_test_run.txt -> docker start (keep alive docker de mierda)
  - Con data: https://github.com/vauxoo-dev/runbot_branch_remote_name_grp_feature2
