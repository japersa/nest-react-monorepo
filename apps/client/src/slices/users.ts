import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: number;
    name: string;
}

interface UserState {
    usersList: User[];
}

const initialState: UserState = {
    usersList: [],
};

export async function fetchUsers(): Promise<User[]> {
    try {
        const res = await fetch('/api/users');
        const users = await res.json();
        return users;
    } catch (e) {
        console.error('Error', e);
        throw e;
    }
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchUsersSuccess: (state, { payload }: PayloadAction<User[]>) => {
            state.usersList.push(...payload);
        },
        fetchUsersError: (_state, { payload }: PayloadAction<any>) => {
            console.error('Error', payload);
        },
    },
});

export const fetchUsersAction = createAction('FETCH_USER');

export const { fetchUsersSuccess } = userSlice.actions;
export default userSlice.reducer;
