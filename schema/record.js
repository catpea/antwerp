const schema = {

  "type": "object",
  "properties": {
    "src": {
      "type": "string"
    },
    "dest": {
      "type": "string"
    },
    "database": {
      "type": "string"
    },
    "attr": {
      "type": "object",
      "properties": {
        "features": {
          "type": "object",
          "properties": {
            "video": {
              "type": "boolean"
            }
          },
          "required": [

          ]
        },
        "id": {
          "type": "string"
        },
        "guid": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": ["string", "null"]
        },
        "tags": {
          "type": "array",
          "items": [
            {
              "type": "string"
            }
          ]
        },
        "date": {
          "type": "string"
        },
        "lastmod": {
          "type": ["string", "null"]
        },
        "weight": {
          "type": "integer"
        },
        "audio": {
          "type": ["string", "null"]
        },
        "image": {
          "type": "string"
        },
        "images": {
          "type": ["null", "array"],
          "items": [
            {
              "type": "string"
            }
          ]
        },
        "artwork": {
          "type": ["null", "array"],
          "items": [
            {
              "type": ["null", "string"]
            }
          ]
        },
        "resources": {
          "type": ["null", "array"],
          "items": [
            {
              "type": ["null", "string"]
            }
          ]
        },
        "raw": {
          "type": "boolean"
        },
        "draft": {
          "type": "boolean"
        },
        "chapter": {
          "type": "integer"
        }
      },
      "required": [
        "features",
        "id",
        "guid",
        "title",
        "description",
        "tags",
        "date",
        "lastmod",
        "weight",
        "audio",
        "image",
        "images",
        "artwork",
        "resources",
        //"raw",
        "draft",
        "chapter"
      ]
    },
    "html": {
      "type": "string"
    },
    "order": {
      "type": "object",
      "properties": {
        "first": {
          "type": "boolean"
        },
        "last": {
          "type": "boolean"
        },
        "prev": {
          "type": "string"
        },
        "next": {
          "type": "string"
        }
      },
      "required": [
        "first",
        "last",
        "prev",
        "next"
      ]
    },
    "attachments": {
      "type": "array",
      "items": {}
    },
    "md": {
      "type": "string"
    },
    "text": {
      "type": "string"
    },
    "snip": {
      "type": "string"
    },
    "number": {
      "type": "integer"
    }
  },
  "required": [
    "src",
    "dest",
    "database",
    "attr",
    "html",
    "order",
    "attachments",
    "md",
    "text",
    "snip",
    "number"
  ]
}


export default schema;
