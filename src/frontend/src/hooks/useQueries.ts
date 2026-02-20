import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SemenStraw, QualityGrade, AvailabilityStatus } from '../backend';

export function useGetAllStraws() {
  const { actor, isFetching } = useActor();

  return useQuery<SemenStraw[]>({
    queryKey: ['straws'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStraws();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStrawById(strawId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SemenStraw | null>({
    queryKey: ['straw', strawId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStrawById(strawId);
    },
    enabled: !!actor && !isFetching && !!strawId,
  });
}

export function useAddStraw() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      strawId: string;
      bullId: string;
      collectionDate: string;
      quality: QualityGrade;
      storageLocation: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addOrUpdateStraw(
        params.strawId,
        params.bullId,
        params.collectionDate,
        params.quality,
        params.storageLocation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['straws'] });
    },
  });
}

export function useUpdateStraw() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      strawId: string;
      bullId: string;
      collectionDate: string;
      quality: QualityGrade;
      storageLocation: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addOrUpdateStraw(
        params.strawId,
        params.bullId,
        params.collectionDate,
        params.quality,
        params.storageLocation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['straws'] });
    },
  });
}

export function useUpdateStrawStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      strawId: string;
      newStatus: AvailabilityStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateStrawStatus(params.strawId, params.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['straws'] });
    },
  });
}
