import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format: (date, formatStr) => format(date, formatStr, { locale: locales['en-US'] }),
  parse: (str, formatStr) => parse(str, formatStr, new Date(), { locale: locales['en-US'] }),
  startOfWeek: () => startOfWeek(new Date(), { locale: locales['en-US'] }),
  getDay: (date) => getDay(date),
  locales,
});

const EventComponent = ({ event }) => {
  const { farm, status, title } = event;
  return (
    <div className="rounded border-l-4 border-l-gray-500 pl-1 text-xs">
      <div className="font-semibold truncate">{title}</div>
      <div className="truncate">{farm}</div>
    </div>
  );
};

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };
  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };
  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  return (
    <div className="flex justify-between items-center p-1 text-xs">
      <div className="flex space-x-1">
        <button onClick={goToBack} className="px-2 py-1 bg-gray-200 rounded">←</button>
        <button onClick={goToCurrent} className="px-2 py-1 bg-gray-200 rounded">Today</button>
        <button onClick={goToNext} className="px-2 py-1 bg-gray-200 rounded">→</button>
      </div>
      <span className="font-bold">{toolbar.label}</span>
      <div></div>
    </div>
  );
};

export default function ProjectCalendar() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewDialogVisible, setViewDialogVisible] = useState(false);
  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    fetchProjects()
  }, []);

  const fetchProjects=()=>{
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/fetch_projects/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const events = data
          .filter(project => project.deadline) 
          .map((project) => {
            const start = new Date(project.deadline);
            const end = new Date(project.deadline);
            
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
              console.warn(`Invalid date for project: ${project.title}`, project.deadline);
              return null;
            }
            
            return {
              id: project.id,
              title: `${project.title}`,
              start: start,
              end: end,
              description: project.description || "No description",
              farm: project.assigned_farm || "Unassigned",
              createdAt: project.created_at,
              status: project.status || "Unknown",
            };
          })
          .filter(event => event !== null);
          
        setProjects(events);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
        setLoading(false);
      });
  }

  const calendarStyles = {
    height: 450,
    fontSize: '0.8rem', 
  };

  const components = {
    event: EventComponent,
    toolbar: CustomToolbar,
  };

  if (loading) return <div className="text-center p-2 text-xs">Loading...</div>;
  if (error) return <div className="text-center p-2 text-xs text-red-500">{error}</div>;

  const handleEventClick = (event) => {
    setSelectedProject(event);
    setSelectedStatus(event.status);
    setViewDialogVisible(true);
  };

  const handleStatusUpdate = () => {
    if (!selectedProject) return;
  
    setUpdatingStatus(true);
    fetch(`http://127.0.0.1:8000/api/update_project_status/${selectedProject.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: selectedStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then((updatedProject) => {
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p.id === updatedProject.id ? { ...p, status: updatedProject.status } : p
          )
        );
        setViewDialogVisible(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update project status.");
      })
      .finally(() => setUpdatingStatus(false));
  };

  const deleteTask=async()=>{
    const res = await fetch("http://127.0.0.1:8000/api/delete_project/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ projectID: selectedProject.id }),
            });
            if (res.ok) {
              toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Task Deleted!' });
              fetchProjects()
              setViewDialogVisible(false)
              
            }
  }
  

  return (
    <div className="calendar-container text-xs">
      <style>
        {`
          .calendar-container .rbc-calendar {
            font-size: 0.75rem;
          }
          .calendar-container .rbc-header {
            padding: 2px 3px;
          }
          .calendar-container .rbc-date-cell {
            padding: 1px;
          }
          .calendar-container .rbc-event {
            padding: 0;
          }
          .calendar-container .rbc-row-content {
            padding-bottom: 2px;
          }
          .calendar-container .rbc-month-view {
            border-radius: 4px;
          }
          .calendar-container .rbc-toolbar {
            margin-bottom: 5px;
          }
          .calendar-container .rbc-toolbar button {
            padding: 3px 6px;
          }
        `}
      </style>
      
      {projects.length === 0 ? (
        <div className="text-center p-2 bg-gray-100 rounded text-xs">
          No projects with deadlines found.
        </div>
      ) : (
        <Calendar
          localizer={localizer}
          events={projects}
          startAccessor="start"
          endAccessor="end"
          style={calendarStyles}
          components={components}
          defaultView="month"
          views={['month']}
          onSelectEvent={handleEventClick}
          eventPropGetter={(event) => ({
            style: { 
              backgroundColor: event.status === 'completed' ? '#22c55e' : '#ef4444',
              color: 'white',
              padding:'2px'
            }
          })}
          dayPropGetter={(date) => ({
            style: {
              margin: 0,
              padding: '1px'
            }
          })}
        />
      )}

    <Dialog 
      header="Project Details"
      visible={viewDialogVisible}
      onHide={() => setViewDialogVisible(false)}
      style={{ width: '500px' }}
    >
     {selectedProject && (
      <div className="text-sm space-y-2">
        <div><strong>Title:</strong> {selectedProject.title}</div>
        <div><strong>Description:</strong> {selectedProject.description}</div>
        <div><strong>Farm:</strong> {selectedProject.farm}</div>
        <div><strong>Status:</strong>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="ml-2 border rounded px-1 py-0.5 text-xs"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div><strong>Deadline:</strong> {new Date(selectedProject.start).toLocaleDateString()}</div>
        <div><strong>Created At:</strong> {new Date(selectedProject.createdAt).toLocaleString()}</div>
        <div className="d-flex justify-content-between">
          <button
            onClick={handleStatusUpdate}
            disabled={updatingStatus}
            className="btn btn-primary btn-sm mt-3"
          >
            {updatingStatus ? 'Updating...' : 'Update Status'}
          </button>
          <button
            onClick={deleteTask}
            className="btn btn-danger btn-sm mt-3"
          >
            Delete Task 
          </button>
        </div>
        
      </div>
    )}

    </Dialog>
    <Toast ref={toast} />
    </div>
  );
}