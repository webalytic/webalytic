import { merge } from 'lodash'

import resource from './resource/resolvers'
import customDefinition from './customDefinition/resolvers'

export default merge(resource, customDefinition)
