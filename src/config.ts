// URL pubblico dei feed, ricavato dal nome del repository quando gira su GitHub Actions.
const repo = process.env.GITHUB_REPOSITORY ?? 'TigBay/audiolibri-feed'
const [owner, name] = repo.split('/')

export const REPO_URL = `https://github.com/${repo}`
export const SITE_URL = `https://${owner.toLowerCase()}.github.io/${name}`
