import reducer from "../auth/authSlice";

/*
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EventService } from "../../api/eventService";
//import { UserService } from "../../api/userService";
import { jwtDecode } from "jwt-decode";

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: number;
}

export interface EventWithCreator extends Event {
  coordinates: number[];
  creatorName: string;
}

interface EventsState {
  events: EventWithCreator[];
  isLoading: boolean;
  isError: boolean;
  message: string | null;
}

const initialState: EventsState = {
  events: [],
  isLoading: false,
  isError: false,
  message: null,
};

const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};
export const fetchEventsThunk = createAsyncThunk<
  EventWithCreator[], 
  void, 
  { rejectValue: string }
>(
  "events/fetchEvents",
   async (_, { rejectWithValue }) => {
    try {
      // 1. Get and validate token
      const token = getTokenFromCookie();
      if (!token) {
        return rejectWithValue("Требуется авторизация");
      }
      // 2. Initialize services
      const eventService = new EventService(token);
      const userService = new UserService(token);

      // 3. Fetch base events data
      const rawEvents = await eventService.fetchEvents();

      // 4. Extract current user info from token
      let currentUser: { id: number | null; name: string } = { 
        id: null, 
        name: "" 
      };
      
      try {
        const decoded = jwtDecode<{ id: number; name: string }>(token);
        currentUser = {
          id: decoded?.id ?? null,
          name: decoded?.name || ""
        };
      } catch (decodeError) {
        console.warn("Не удалось декодировать токен:", decodeError);
      }

      // 5. Enrich events with additional data
      const enrichedEvents = await Promise.all(
        rawEvents.map(async (event) => {
          const creatorName = await getCreatorName(
            event.createdBy,
            currentUser,
            userService
          );

          return {
            ...event,
            creatorName,
          };
        })
      );

      return enrichedEvents;

    } catch (error) {
      console.error("Ошибка загрузки событий:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Неизвестная ошибка при загрузке событий";
      return rejectWithValue(errorMessage);
    }
  }
);

const parseCoordinates = (location: string): number[] => {
  return location
    .split(",")
    .map((coord) => parseFloat(coord.trim()))
    .filter(coord => !isNaN(coord));
};

const getCreatorName = async (
  creatorId: number,
  currentUser: { id: number | null; name: string },
  userService: UserService
): Promise<string> => {
  if (creatorId === currentUser.id) {
    return currentUser.name || "Вы";
  }

  try {
    const creator = await userService.fetchUserById(creatorId);
    return creator.name || "Неизвестный пользователь";
  } catch (error) {
    console.warn(`Не удалось получить пользователя ${creatorId}:`, error);
    return "Неизвестный пользователь";
  }
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventsState: (state) => {
      state.events = [];
      state.isError = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.events = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Неизвестная ошибка";
      });
  },
});

export const { clearEventsState } = eventsSlice.actions;
export default eventsSlice.reducer;
*/
export default reducer;