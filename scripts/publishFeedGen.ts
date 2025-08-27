import dotenv from 'dotenv'
import { AtpAgent, BlobRef } from '@atproto/api'
import fs from 'fs/promises'
import { ids } from '../src/lexicon/lexicons'

const vibesAlgoSettings = {
  recordName: 'tech-vibes',
  displayName: 'Indie Dev',
  description: "A feed focusing on people's personal projects including open source software 💽, game dev 🕹️, hardware hacking ⚡️, and more!\nLike and pin this feed to join a community of indie tech creators and to see more cool projects across Bluesky!",
  avatar: './avatar.png'
}

const rickRollSettings = {
  recordName: 'nggyunglyd',
  displayName: "Rolling Hills",
  description: "A lovely feed containing trending nature and tech content that will never let you down...",
  avatar: './avatar-rick-roll.png'
}

const run = async (settings: typeof vibesAlgoSettings | typeof rickRollSettings) => {
  dotenv.config()

  // YOUR bluesky handle
  // Ex: user.bsky.social
  const handle = 'idreesinc.com'

  // YOUR bluesky password, or preferably an App Password (found in your client settings)
  // Ex: abcd-1234-efgh-5678
  const secrets = require('../src/secrets.json');
  const password = secrets.password;

  // A short name for the record that will show in urls
  // Lowercase with no spaces.
  // Ex: whats-hot
  const recordName = settings.recordName

  // A display name for your feed
  // Ex: What's Hot
  const displayName = settings.displayName

  // (Optional) A description of your feed
  // Ex: Top trending content from the whole network
  const description = settings.description

  // (Optional) The path to an image to be used as your feed's avatar
  // Ex: ~/path/to/avatar.jpeg
  const avatar: string = settings.avatar

  // -------------------------------------
  // NO NEED TO TOUCH ANYTHING BELOW HERE
  // -------------------------------------

  if (!process.env.FEEDGEN_SERVICE_DID && !process.env.FEEDGEN_HOSTNAME) {
    throw new Error('Please provide a hostname in the .env file')
  }
  console.log(process.env.FEEDGEN_HOSTNAME)
  const feedGenDid =
    process.env.FEEDGEN_SERVICE_DID ?? `did:web:${process.env.FEEDGEN_HOSTNAME}`

  // only update this if in a test environment
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })

  let avatarRef: BlobRef | undefined
  if (avatar) {
    let encoding: string
    if (avatar.endsWith('png')) {
      encoding = 'image/png'
    } else if (avatar.endsWith('jpg') || avatar.endsWith('jpeg')) {
      encoding = 'image/jpeg'
    } else {
      throw new Error('expected png or jpeg')
    }
    const img = await fs.readFile(avatar)
    const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, {
      encoding,
    })
    avatarRef = blobRes.data.blob
  }

  await agent.api.com.atproto.repo.putRecord({
    repo: agent.session?.did ?? '',
    collection: ids.AppBskyFeedGenerator,
    rkey: recordName,
    record: {
      did: feedGenDid,
      displayName: displayName,
      description: description,
      avatar: avatarRef,
      createdAt: new Date().toISOString(),
    },
  })

  console.log('All done 🎉')
}

run(vibesAlgoSettings)
run(rickRollSettings)