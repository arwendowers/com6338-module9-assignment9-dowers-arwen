const getPoemBtn = document.getElementById('get-poem')
const poemEl = document.getElementById('poem')
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'

const getJSON = url => fetch(url).then(res => res.json())

const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg)

const makeTag = tag => str => `<${tag}>${str}</${tag}>`

const makePoemHTML = data => {
  const { title, author, lines } = data[0]
  const titleTag = makeTag('h2')(title)
  const authorTag = pipe(a => `by ${a}`, makeTag('em'), makeTag('h3'))(author)

  const stanzaTags = lines
    .join('\n') // joins lines off array into a block of text
    .split('\n\n') // splits text where there are two newlines, separating the stanzas
    .filter(stanza => stanza.trim()) // removes any empty strings at the end of poems
    .map(stanza => {
      const linesWithBreaks = stanza
        .split('\n') // turns text back into an array of individual lines
        .join('<br>') // puts a break between each line
      return makeTag('p')(linesWithBreaks)
    })
    .join('') // turns array of stanzas into one string of paragraph tags

  const poem = titleTag + authorTag + stanzaTags
  return poem
}

// attach a click event to #get-poem
getPoemBtn.onclick = async function() {
  // renders the HTML string returned by makePoemHTML to #poem
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL))
}
