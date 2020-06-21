export default function useUniqueID () {
  let UUID = Math.floor(Math.random() * 1000000000)
  const UUIDBindings = new Map()

  function getID (model) {
    if (UUIDBindings.has(model)) {
      return UUIDBindings.get(model)
    } else {
      UUID++
      UUIDBindings.set(model, UUID)
      return UUID
    }
  }

  return {
    UUID,
    UUIDBindings,
    getID
  }
}
