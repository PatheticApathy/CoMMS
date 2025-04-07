# DockerFile for Material API

## Env variables

- MATERIAL_HOST: address of API
- MATERIALDB: location of DB(may remove at a later date)
- USER_HOST: user API address

## Running

To build, go to the parent directory and run

```Bash
Docker build -f ./build/material_api/Dockerfile -t <insert-name> .
```

Then you can run with the name you gave it

```Bash
Docker run <insert-name>
```
