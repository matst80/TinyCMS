# TinyCMS

## Docs

[Explore the basic concepts](/docs/concepts.md)

## Builds
Master branch: [![Build status](https://khnilsson.visualstudio.com/TinyCMS/_apis/build/status/TinyCMS-ASP.NET%20Core-CI)](https://khnilsson.visualstudio.com/TinyCMS/_build/latest?definitionId=2)

## Under development

to set the JWT secret set the secret:

```
dotnet user-secrets set "JWTSecret" "random string as a secret"
```

Navigate to the TinyCMS folder

```
cd ./TinyCMS
```

Run the project (this sample will be using a React Web Client)
```
dotnet run
```


## Example json structure for Nodes.json

```json
{
    "isDirty": false,
    "rootNode": {
        "type": "site",
        "id": "root",
        "isParsed": false,
        "children": [
            {
                "type": "page",
                "name": "Shop",
                "url": "/shop",
                "templateId": "page",
                "id": "a480136e-0327-441b-8155-eda1cf166c34",
                "isParsed": true,
                "children": [
                    {
                        "type": "text",
                        "value": "dfgdfgdfg",
                        "id": "74f60485-285d-4923-8168-13f24be535f3",
                        "isParsed": true,
                        "children": []
                    },
                    {
                        "id": "dbbf7075-0239-419f-9701-727aae45223b",
                        "pageid": 1669,
                        "parentId": "a480136e-0327-441b-8155-eda1cf166c34",
                        "isParsed": true,
                        "type": "nodeproduct",
                        "children": []
                    }
                ]
            }
        ]
    },
    "relations": []
}
```