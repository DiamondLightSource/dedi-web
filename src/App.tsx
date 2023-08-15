import * as React from 'react'
import './App.css'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

function App(): JSX.Element {
  const [count, setCount] = React.useState(0)

  return (
    <>
      <div >
        <h1>Dedi Web</h1>
        <Tabs>
          <TabList>
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>
    </>
  )
}

export default App
