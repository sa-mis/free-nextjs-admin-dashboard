"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import InputField from "@/components/form/input/InputField";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import Badge from "@/components/ui/badge/Badge";
import { pmScheduleAPI, PmSchedule } from "@/services/pmSchedule";
import { assetAPI } from "@/services/asset";
import { toolAPI } from "@/services/tool";
import { departmentService } from "@/services/organization";
import { userAPI } from "@/services/user";
import { maintenanceTypeAPI } from "@/services/maintenanceType";
import toast from "react-hot-toast";

interface CalendarEvent extends EventInput {
  extendedProps: {
    pmSchedule: PmSchedule;
    status: 'overdue' | 'due_soon' | 'on_schedule' | 'completed';
  };
}

interface FilterOptions {
  assets: { id: number; name: string }[];
  tools: { id: number; name: string }[];
  divisions: { id: number; name: string }[];
  responsible: { id: number; name: string }[];
  maintenanceTypes: { id: number; name: string }[];
}

const PmCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [pmSchedules, setPmSchedules] = useState<PmSchedule[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    assets: [],
    tools: [],
    divisions: [],
    responsible: [],
    maintenanceTypes: [],
  });
  const [filters, setFilters] = useState({
    asset_id: '',
    tool_id: '',
    division_id: '',
    responsible_id: '',
    maintenance_type_id: '',
  });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  
  // Dropdown states
  const [dropdownStates, setDropdownStates] = useState({
    asset: false,
    tool: false,
    division: false,
    responsible: false,
    maintenanceType: false,
  });

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [assetsRes, toolsRes, divisionsRes, usersRes, maintenanceTypesRes] = await Promise.all([
          assetAPI.getAll({ limit: 1000 }),
          toolAPI.getAll({ limit: 1000 }),
          departmentService.getAll(),
          userAPI.getUsers({ limit: 1000 }),
          maintenanceTypeAPI.getAll({ limit: 1000 }),
        ]);

        setFilterOptions({
          assets: assetsRes.data.map((asset: any) => ({ id: asset.id, name: asset.name })),
          tools: toolsRes.data.map((tool: any) => ({ id: tool.id, name: tool.name })),
          divisions: divisionsRes.map((division: any) => ({ id: division.id, name: division.name })),
          responsible: usersRes.data.map((user: any) => ({ id: user.id, name: user.name || user.email })),
          maintenanceTypes: maintenanceTypesRes.data.map((type: any) => ({ id: type.id, name: type.name })),
        });
      } catch (error) {
        console.error('Error loading filter options:', error);
        toast.error('Failed to load filter options');
      }
    };

    loadFilterOptions();
  }, []);

  // Load PM schedules
  useEffect(() => {
    const loadPmSchedules = async () => {
      try {
        setIsLoading(true);
        const params: any = { limit: 1000 };
        
        // Apply filters
        if (filters.asset_id) params.asset_id = filters.asset_id;
        if (filters.tool_id) params.tool_id = filters.tool_id;
        if (filters.division_id) params.responsible_division_id = filters.division_id;
        if (filters.responsible_id) params.assigned_to = filters.responsible_id;
        if (filters.maintenance_type_id) params.maintenance_type_id = filters.maintenance_type_id;

        const response = await pmScheduleAPI.getAll(params);
        setPmSchedules(response.data);
        
        // Convert PM schedules to calendar events
        const calendarEvents: CalendarEvent[] = response.data.map((schedule: PmSchedule) => {
          const nextDueDate = new Date(schedule.next_due_date);
          const today = new Date();
          const daysUntilDue = Math.ceil((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          let status: 'overdue' | 'due_soon' | 'on_schedule' | 'completed' = 'on_schedule';
          if (daysUntilDue < 0) {
            status = 'overdue';
          } else if (daysUntilDue <= 7) {
            status = 'due_soon';
          }

          return {
            id: schedule.id.toString(),
            title: `${schedule.name} - ${schedule.maintenance_type?.name || 'Maintenance'}`,
            start: schedule.next_due_date,
            end: schedule.next_due_date,
            allDay: true,
            extendedProps: {
              pmSchedule: schedule,
              status,
            },
          };
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error loading PM schedules:', error);
        toast.error('Failed to load PM schedules');
      } finally {
        setIsLoading(false);
      }
    };

    loadPmSchedules();
  }, [filters]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openModal();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      asset_id: '',
      tool_id: '',
      division_id: '',
      responsible_id: '',
      maintenance_type_id: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'error';
      case 'due_soon':
        return 'warning';
      case 'on_schedule':
        return 'success';
      case 'completed':
        return 'info';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'Overdue';
      case 'due_soon':
        return 'Due Soon';
      case 'on_schedule':
        return 'On Schedule';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const status = eventInfo.event.extendedProps.status;
    const colorClass = `fc-bg-${getStatusColor(status)}`;
    
    return (
      <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading PM Schedule Calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            PM Schedule Calendar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage preventive maintenance schedules
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Filters
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Asset Filter */}
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Asset
            </label>
            <button
              onClick={() => setDropdownStates(prev => ({ ...prev, asset: !prev.asset }))}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              {filters.asset_id 
                ? filterOptions.assets.find(a => a.id.toString() === filters.asset_id)?.name || 'Select Asset'
                : 'All Assets'
              }
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Dropdown
              isOpen={dropdownStates.asset}
              onClose={() => setDropdownStates(prev => ({ ...prev, asset: false }))}
              className="w-full"
            >
              <DropdownItem onClick={() => { handleFilterChange('asset_id', ''); setDropdownStates(prev => ({ ...prev, asset: false })); }}>
                All Assets
              </DropdownItem>
              {filterOptions.assets.map((asset) => (
                <DropdownItem
                  key={asset.id}
                  onClick={() => { handleFilterChange('asset_id', asset.id.toString()); setDropdownStates(prev => ({ ...prev, asset: false })); }}
                >
                  {asset.name}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          {/* Tool Filter */}
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tool
            </label>
            <button
              onClick={() => setDropdownStates(prev => ({ ...prev, tool: !prev.tool }))}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              {filters.tool_id 
                ? filterOptions.tools.find(t => t.id.toString() === filters.tool_id)?.name || 'Select Tool'
                : 'All Tools'
              }
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Dropdown
              isOpen={dropdownStates.tool}
              onClose={() => setDropdownStates(prev => ({ ...prev, tool: false }))}
              className="w-full"
            >
              <DropdownItem onClick={() => { handleFilterChange('tool_id', ''); setDropdownStates(prev => ({ ...prev, tool: false })); }}>
                All Tools
              </DropdownItem>
              {filterOptions.tools.map((tool) => (
                <DropdownItem
                  key={tool.id}
                  onClick={() => { handleFilterChange('tool_id', tool.id.toString()); setDropdownStates(prev => ({ ...prev, tool: false })); }}
                >
                  {tool.name}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          {/* Division Filter */}
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Division
            </label>
            <button
              onClick={() => setDropdownStates(prev => ({ ...prev, division: !prev.division }))}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              {filters.division_id 
                ? filterOptions.divisions.find(d => d.id.toString() === filters.division_id)?.name || 'Select Division'
                : 'All Divisions'
              }
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Dropdown
              isOpen={dropdownStates.division}
              onClose={() => setDropdownStates(prev => ({ ...prev, division: false }))}
              className="w-full"
            >
              <DropdownItem onClick={() => { handleFilterChange('division_id', ''); setDropdownStates(prev => ({ ...prev, division: false })); }}>
                All Divisions
              </DropdownItem>
              {filterOptions.divisions.map((division) => (
                <DropdownItem
                  key={division.id}
                  onClick={() => { handleFilterChange('division_id', division.id.toString()); setDropdownStates(prev => ({ ...prev, division: false })); }}
                >
                  {division.name}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          {/* Responsible Filter */}
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Responsible
            </label>
            <button
              onClick={() => setDropdownStates(prev => ({ ...prev, responsible: !prev.responsible }))}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              {filters.responsible_id 
                ? filterOptions.responsible.find(r => r.id.toString() === filters.responsible_id)?.name || 'Select User'
                : 'All Users'
              }
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Dropdown
              isOpen={dropdownStates.responsible}
              onClose={() => setDropdownStates(prev => ({ ...prev, responsible: false }))}
              className="w-full"
            >
              <DropdownItem onClick={() => { handleFilterChange('responsible_id', ''); setDropdownStates(prev => ({ ...prev, responsible: false })); }}>
                All Users
              </DropdownItem>
              {filterOptions.responsible.map((user) => (
                <DropdownItem
                  key={user.id}
                  onClick={() => { handleFilterChange('responsible_id', user.id.toString()); setDropdownStates(prev => ({ ...prev, responsible: false })); }}
                >
                  {user.name}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          {/* Maintenance Type Filter */}
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Maintenance Type
            </label>
            <button
              onClick={() => setDropdownStates(prev => ({ ...prev, maintenanceType: !prev.maintenanceType }))}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              {filters.maintenance_type_id 
                ? filterOptions.maintenanceTypes.find(m => m.id.toString() === filters.maintenance_type_id)?.name || 'Select Type'
                : 'All Types'
              }
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Dropdown
              isOpen={dropdownStates.maintenanceType}
              onClose={() => setDropdownStates(prev => ({ ...prev, maintenanceType: false }))}
              className="w-full"
            >
              <DropdownItem onClick={() => { handleFilterChange('maintenance_type_id', ''); setDropdownStates(prev => ({ ...prev, maintenanceType: false })); }}>
                All Types
              </DropdownItem>
              {filterOptions.maintenanceTypes.map((type) => (
                <DropdownItem
                  key={type.id}
                  onClick={() => { handleFilterChange('maintenance_type_id', type.id.toString()); setDropdownStates(prev => ({ ...prev, maintenanceType: false })); }}
                >
                  {type.name}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="auto"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Status Legend
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">Due Soon (≤7 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">On Schedule</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">Completed</span>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        {selectedEvent && (
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                PM Schedule Details
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View detailed information about this maintenance schedule
              </p>
            </div>
            
            <div className="mt-8 space-y-6">
              <div>
                <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {selectedEvent.title}
                </h6>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Status
                    </label>
                    <Badge color={getStatusColor(selectedEvent.extendedProps.status)}>
                      {getStatusText(selectedEvent.extendedProps.status)}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Next Due Date
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedEvent.extendedProps.pmSchedule.next_due_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Frequency
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedEvent.extendedProps.pmSchedule.frequency_value} {selectedEvent.extendedProps.pmSchedule.frequency_type}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Estimated Hours
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedEvent.extendedProps.pmSchedule.estimated_hours} hours
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Estimated Cost
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      ${selectedEvent.extendedProps.pmSchedule.estimated_cost}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Assigned To
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedEvent.extendedProps.pmSchedule.assigned_user?.name || 'Not assigned'}
                    </p>
                  </div>
                </div>
                
                {selectedEvent.extendedProps.pmSchedule.description && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                      Description
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedEvent.extendedProps.pmSchedule.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <Button
                variant="outline"
                onClick={closeModal}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: Navigate to edit page or open edit modal
                  closeModal();
                }}
              >
                Edit Schedule
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PmCalendar; 