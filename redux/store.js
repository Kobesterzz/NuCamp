import { configureStore } from '@reduxjs/toolkit';
import { campsitesReducer } from '../features/campsites/campsitesSlice';
import { commentsReducer } from '../features/campsites/comments/commentSlice';
import { partnersReducer } from '../features/campsites/partners/partnerSlice';
import { promotionsReducer } from '../features/campsites/promotions/promotionsSlice';
import { favoritesReducer } from '../features/campsites/favorites/favoritesSlice';
import {
    persistStore,
    persistCombineReducers,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
    key: 'root',
    storage: AsyncStorage,
    debug: true
};

export const store = configureStore({
    reducer: persistCombineReducers(config, {
        campsites: campsitesReducer,
        comments: commentsReducer,
        partners: partnersReducer,
        promotions: promotionsReducer,
        favorites: favoritesReducer
    }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER
                ]
            }
        })
});

export const persistor = persistStore(store)