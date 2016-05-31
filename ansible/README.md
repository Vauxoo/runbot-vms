How to use this files
---

This ansible recipes are written to work with vagrant an by themselves.

```
    ansible-playbook provision-runbot.yml -i inventory --extra-vars="host=host_in_inventory"
```

Only add the desire host to the inventory file as specified in the [official documentation](http://docs.ansible.com/ansible/intro_inventory.html)
 
Every app is configured in a different playbook and the main file (provision-runbot.yml) is the one that connects all of them.
