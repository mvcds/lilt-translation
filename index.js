const axios = require('axios')
const fs = require('fs')

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

async function save (translation) {
  const [ language, file ] = await translation

  const filename = this.getFileName(language)

  fs.writeFile(filename, JSON.stringify(file, null, 2), (err) => {
    if (err) throw err
    this.success(language)
  })
}

async function saveTranslationFromDocuments ({ documents, key, ...rest }) {
  const translations = await translateFromDocuments({ documents, key })

  return translations.forEach(save, rest)
}

module.exports = {
  translateFromDocuments,
  saveTranslationFromDocuments
}
