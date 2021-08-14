/**
 * A helper function to make creating plugins easier
 * @param plugin The plugin function or object
 */
export default function definePlugin (plugin) {
  // function plugin
  if (typeof plugin === 'function') {
    return plugin
  }

  // plugin with advanced options
  const pluginFn = plugin.setup
  if ('extend' in plugin) {
    pluginFn.extend = plugin.extend
  }

  return pluginFn
}
