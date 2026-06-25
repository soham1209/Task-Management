import { useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 py-12">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <h1 className="text-3xl font-bold text-slate-900">Task Manager</h1>
        <TaskForm onTaskCreated={() => setRefreshTrigger((value) => value + 1)} />
        <TaskList
          refreshTrigger={refreshTrigger}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </main>
    </div>
  )
}

export default App
