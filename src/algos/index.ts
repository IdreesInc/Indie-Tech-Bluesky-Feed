import { BskyAgent } from '@atproto/api'
import { AppContext } from '../config'
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import * as vibesAlgo from './vibes-algorithm'
import * as neverGonnaGiveYouUpAlgo from './never-gonna-give-you-up'


type AlgoHandler = (ctx: AppContext, params: QueryParams, agent: BskyAgent) => Promise<AlgoOutput>

const algos: Record<string, AlgoHandler> = {
  [vibesAlgo.shortname]: vibesAlgo.handler,
  [neverGonnaGiveYouUpAlgo.shortname]: neverGonnaGiveYouUpAlgo.handler
}

export default algos
