import { useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="app max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Task Manager</h1>
      <TaskForm onTaskCreated={() => setRefreshKey((key) => key + 1)} />
      <TaskList refreshTrigger={refreshKey} />
    </div>
  )
}

export default App
