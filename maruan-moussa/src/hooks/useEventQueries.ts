import { EventModel, EventCreateDTO  } from "@/dto/EventModelDto";
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from "@/services/eventService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const EVENTS_KEY = ["events"];


export const useEvents = () => {
    return useQuery<EventModel[]>({
        queryKey: EVENTS_KEY,
        queryFn: getEvents,
    });
};

export const useEventById = (id?: number)  => {
    return useQuery<EventModel>({
        queryKey: [...EVENTS_KEY, id],
        queryFn: () => getEventById(id!),
        enabled: !!id,
    });
};

export const useCreateEvent = () => {
const queryClient = useQueryClient();
    
return useMutation({
    mutationFn: (newEvent: EventCreateDTO) => createEvent(newEvent),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: EVENTS_KEY });
    },    
});
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: {id: number, data: EventCreateDTO}) => 
            updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: EVENTS_KEY});
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: EVENTS_KEY});
        },
    });
};