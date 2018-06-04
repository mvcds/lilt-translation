const axios = require('axios')

//  https://lilt.com/kb/api/document-translation
const LILT_API = 'https://lilt.com/2'

async function getSegments (id, key) {
  const params = { key, id }
  const url = `${LILT_API}/documents`

  const { data } = await axios.get(url, { params })

  return data.segments
}

function translateSegment (translation, { source, target }) {
  return {
    ...translation,
    [source]: target || source
  }
}

async function translate ([ language, id ]) {
  const segments = await getSegments(id, this.key)

  const translation = segments.reduce(translateSegment, {})

  return [ language, translation ]
}

async function translateFromDocuments ({ documents, key }) {
  return Object.entries(documents)
    .map(translate, { key })
}

module.exports = {
  translateFromDocuments
}
