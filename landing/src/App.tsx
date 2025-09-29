import { useState, useEffect } from 'react'

const App = () => {
  const [isVisible, setIsVisible] = useState(false)
  
  const landingText = `hi. this is sahil. i built this app.

everyone's scared that ai is going to take their jobs, take over the world, etc.

now i don't have a plan to fix that.

however, i do have a plan to build ai tools that help us become better humans.

so i built this journaling app.

you write for 5 minutes and once you finish, you click "Go deeper" to be prompted to answer an introspective question.

over time, the app better understands how you think and is able to point out tendencies and connections across your different entries.

i hate calling this an ai journaling app. i like to think of it as a journaling app with ai. the journaling is the main focus. the ai is just a little side character that's helpful when you want it to be.

so give it a try. roast me, i won't be offended.

p.s: you can delete this text if you want :)`
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const downloadRelease = async (filter: (asset: any) => boolean) => {
    try {
      const response = await fetch("https://api.github.com/repos/sahil-lalani/ai-journal-releases/releases")
      const releases = await response.json()
      
      const release = releases
        .filter((r: any) => r.assets.some(filter))
        .sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0]
      
      if (release) {
        window.location.href = release.assets.find(filter).browser_download_url
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 md:px-32 py-16">
      <div className={`prose prose-lg max-w-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          className="min-h-[200px] p-6 focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}
          dangerouslySetInnerHTML={{ __html: landingText.replace(/\n\n/g, '<br><br>') }}
        />
        
        <h2 className="mt-8 text-2xl font-bold">Download AI Journal</h2>
        
        <div className="not-prose flex flex-col md:flex-row gap-4 my-6">
          <button
            onClick={() => downloadRelease(a => a.name.includes('-x64.dmg') && !a.name.includes('.blockmap'))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Download for Intel Mac
          </button>
          
          <button
            onClick={() => downloadRelease(a => a.name.includes('-arm64.dmg') && !a.name.includes('.blockmap'))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Download for Apple Silicon Mac
          </button>
          
          <button
            onClick={() => downloadRelease(a => a.name.includes('.exe'))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Download for Windows
          </button>
        </div>
      </div>
    </div>
  )
}

export default App