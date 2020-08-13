import { Dependencies } from '../src/container'

export default async (deps: Dependencies): Promise<void> => {
  const {
    ResourceModel
  } = deps

  await ResourceModel.destroy({ where: {} })
}
