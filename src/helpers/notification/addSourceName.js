/*
Description: this function takes the referance name and add that to the notification (text)
*/

module.exports = (ref) => {
  if (!ref) throw new Error('no ref found!')
  switch (ref.toUpperCase()) {
    case 'POST':
      return 'post'
      break
    case 'COMMENT':
      return 'comment'
      break
    case 'REPLIE':
      return 'reply'
      break
    case 'STORY':
      return 'story'
      break
  }
}
