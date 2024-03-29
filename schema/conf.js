
const configuration = {
  type: "object",
  properties: {
    samples: {type: "string"},
    verbosity: {type: "integer"},
    home: {type: "string"},
    src: {type: "string"},
    dest: {type: "string"},
    audio: {type: "string"},
    video: {type: "string"},
    chapters: {type: "string"},
    theme: {type: "string"},
    cache: {type: "string"},
    snippets: {type: "string"},
    pp: {type: "integer"},
    noMp3: {type: "boolean"},
    removeUnusedFiles: {type: "boolean"},
    force: {type: "boolean"},
    debug: {type: "boolean"},
  },
  required: ['home', 'src', 'dest', 'video', 'theme', 'samples', 'cache', 'pp', 'noMp3'],
  additionalProperties: false,
}

const website = {
  type: "object",
  properties: {
    title: {type: "string"},
    version: {type: "string"},
    variant: {type: "string"},
  },
  required: ['title', 'version','variant'],
  additionalProperties: true,
};

const creators = {
  type: "object",
  // additionalProperties: true,
};

const network = {
  type: "array",
  items: [
    {
      type: "object",
      properties: {
        title: {type: "string"},
        url: {type: "string"},
        navigation: {type: "boolean"},
        superImportant: {type: "boolean"},
        mirror: {type: "boolean"},
        veryImportant: {type: "boolean"},
        social: {type: "boolean"},
      },
      required: ['title', 'url'],
      additionalProperties: true,
    }
  ],
  minItems: 1,
  maxItems: 300,
  // additionalItems: false,
};

const covers = {
  type: "array",
  items: [
    {
      type: "object",
      properties: {
        prefix: {type: "string"},
        width: {type: "integer"},
        height: {type: "integer"},
      },
      required: ['prefix', 'width', 'height'],
      additionalProperties: false,
    }
  ],
  minItems: 1,
  maxItems: 12,
  // additionalItems: false,
};


const alerts = {
  type: "array",
  items: [{type: 'object', anyOf:[
    {
      type: "object",
      properties: {
        type: {enum: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']},
        html: {type: "string"},
        urgent: {type: "boolean"},
      },
      required: ['type', 'html'],
      additionalProperties: false,
    },
    {
      type: "object",
      properties: {
        type: {enum: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']},
        text: {type: "string"},
        link: { type: "object", properties: { title: {type: "string"}, url: {type: "string"}, }, required: ['title', 'url'], additionalProperties: true, },
        note: {type: "string"},
        urgent: {type: "boolean"},
      },
      required: ['type', 'text'],
      additionalProperties: false,
    },
  ]}],
  minItems: 0,
  maxItems: 10,

};





const schema = {
  type: "object",
  properties: {
    configuration,
    covers,
    site: {
      type: "object",
      properties: {
        website,
        debug: {type: "boolean"},
        network,
        alerts,
      },
      required: ['website', 'network', 'alerts'],
      additionalProperties: true,
    },
    creators,
  },
  required: ['configuration', 'site'],
  additionalProperties: true,
}

export default schema;
