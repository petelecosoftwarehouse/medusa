import { IInventoryService, InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type Result = {
  tag: string
  inventoryItem: InventoryItemDTO
}[]

export async function createInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: (InventoryItemDTO & { _associationTag?: string })[]
}>): Promise<Result | void> {
  console.log(data)
  const inventoryService: IInventoryService =
    container.resolve("inventoryService")

  if (!inventoryService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'createInventoryItems' will be skipped.`
    )
    return void 0
  }

  const result = await Promise.all(
    data.inventoryItems.map(async (item) => {
      const inventoryItem = await inventoryService!.createInventoryItem({
        sku: item.sku!,
        origin_country: item.origin_country!,
        hs_code: item.hs_code!,
        mid_code: item.mid_code!,
        material: item.material!,
        weight: item.weight!,
        length: item.length!,
        height: item.height!,
        width: item.width!,
      })

      return { tag: item._associationTag ?? inventoryItem.id, inventoryItem }
    })
  )

  return result
}

createInventoryItems.aliases = {
  payload: "payload",
}
