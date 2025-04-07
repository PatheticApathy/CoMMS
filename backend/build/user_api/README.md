# DockerFile for Material API

## Env variables

- USER_HOST= address of api
- USERDB = location of db(may remove later)
- SECRETKEY = must be 32 charcaters
- NOMINATIM_HOST = geodata server host

## Running

To build, go to the parent directory and run

```Bash
Docker build -f ./build/user_api/Dockerfile -t <insert-name> .
```

Then you can run with the name you gave it

```Bash
Docker run <insert-name>
```
