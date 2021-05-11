import React from 'react'

export const parseTemplateText = (text) => {
  const patterns = {
    '<bcl>': '</bcl>',
    '<bcm>': '</bcm>',
    '<bcr>': '</bcr>',
  }
  const shortPatterns = {
    '<bcl>': 'backgroundColorLeft',
    '<bcm>': 'backgroundColorMiddle',
    '<bcr>': 'backgroundColorRight',
  }
  // or <#091234>

  const result = []
  let inTag = false
  let tagStart = 0
  let tag = ''
  let segmentStart = 0
  for (let i = 0; i < text.length; i++) {
    if (inTag && text.substring(i, i+6) === patterns[tag]) {
      const tagText = text.substring(tagStart+5, i)
      result.push({ text: tagText, tag, color: shortPatterns[tag] })

      inTag = false
      i = i+6
      tag = ''
      segmentStart = i
    }
    else if (inTag && /<\/#[0-9a-fA-F]{6}>/.test(text.substring(i, i+10))) {
      const tagText = text.substring(tagStart+9, i)
      result.push({ text: tagText, tag, color: tag.substring(1, 8) })

      inTag = false
      i = i+10
      tag = ''
      segmentStart = i
    }
    else if (text.substring(i, i+5) in patterns) {
      result.push(text.substring(segmentStart, i))
      inTag = true
      tag = text.substring(i, i+5)
      tagStart = i
      i = i+5
    }
    else if (/<#[0-9a-fA-F]{6}>/.test(text.substring(i, i+9))) {
      result.push(text.substring(segmentStart, i))
      inTag = true
      tag = text.substring(i, i+9)
      tagStart = i
      i = i+9
    }
  }
  result.push(text.substring(segmentStart))
  return result
}

export function styleText(text, colorNames) {
  const pieces = parseTemplateText(text)
  return pieces.map((piece) => {
    if (typeof piece === 'string') {
      return piece
    } else if (piece.color in colorNames) {
      return <span style={{color: colorNames[piece.color]}}>{piece.text}</span>
    } else {
      return <span style={{color: piece.color}}>{piece.text}</span>
    }
  })
}
