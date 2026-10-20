
    importScripts('/lib/sw-toolbox.js')
    
    self.toolbox.router.get(
      /^https:\/\/[^.]+\.[^.]+\.[^./]+(\/?|\/[^.?]+)$/,
      self.toolbox.networkFirst,
      {
        cache: {
          name: 'content-cache-v2'
        }
      }
    )
    