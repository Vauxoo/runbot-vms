How to use this Vagrantfile
---

Just execute:

```
    vagrant up
```
    
It may take some time depending on your internet connection.

You can modify the domain and regex for the domain used in the Vagrantfile:

```ruby
    domain: "runbot.vauxoo.com",
    regex_domain: "~^(.*)\.runbot\.vauxoo\.colima$"
``` 

It'll be replaced in the nginx configuration file. By default creates a VM with 2GB of ram, this also can be changed in:

```ruby
    vb.memory = "2048"
```

The provisioning is made by the ansible files located in the ansible folder, they are separated
by application (instance, docker, postgres and nginx) so it is easier to debug.
