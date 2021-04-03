import prompts from 'prompts'

export async function confirm(message: string) {
  const result = await prompts({
    type: 'confirm',
    name: 'value',
    message
  })
  return <boolean>result.value
}
