import { api } from '@/scripts/api'
import { app } from '@/scripts/app'
import { useExtensionService } from '@/services/extensionService'

useExtensionService().registerExtension({
  name: 'Comfy.ImageCompare',

  async nodeCreated(node) {
    if (node.constructor.comfyClass !== 'ImageCompare') return

    const [oldWidth, oldHeight] = node.size
    node.setSize([Math.max(oldWidth, 400), Math.max(oldHeight, 350)])

    const onExecuted = node.onExecuted

    node.onExecuted = function (message: any) {
      onExecuted?.apply(this, arguments as any)

      const aImages = message.a_images ?? []
      const bImages = message.b_images ?? []
      const rand = app.getRandParam()

      const beforeUrl =
        aImages.length > 0
          ? api.apiURL(`/view?${new URLSearchParams(aImages[0])}${rand}`)
          : ''
      const afterUrl =
        bImages.length > 0
          ? api.apiURL(`/view?${new URLSearchParams(bImages[0])}${rand}`)
          : ''

      const widget = node.widgets?.find((w) => w.type === 'imagecompare')

      if (widget) {
        widget.value = {
          before: beforeUrl,
          after: afterUrl
        }
        widget.callback?.(widget.value)
      }
    }
  }
})
