import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SemenStraw, Sale, SaleBill, QualityGrade, AvailabilityStatus } from '../backend';

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
      quantity: bigint;
      colorCode: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addOrUpdateStraw(
        params.strawId,
        params.bullId,
        params.collectionDate,
        params.quality,
        params.storageLocation,
        params.quantity,
        params.colorCode
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
      quantity: bigint;
      colorCode: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addOrUpdateStraw(
        params.strawId,
        params.bullId,
        params.collectionDate,
        params.quality,
        params.storageLocation,
        params.quantity,
        params.colorCode
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

export function useCreateSale() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      strawId: string;
      saleDate: string;
      buyerName: string;
      buyerContact: string;
      quantitySold: bigint;
      salePrice: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createSale(
        params.strawId,
        params.saleDate,
        params.buyerName,
        params.buyerContact,
        params.quantitySold,
        params.salePrice
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['straws'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });
}

export function useGetAllSales() {
  const { actor, isFetching } = useActor();

  return useQuery<Sale[]>({
    queryKey: ['sales'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSales();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSaleById(saleId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Sale | null>({
    queryKey: ['sale', saleId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSaleById(saleId);
    },
    enabled: !!actor && !isFetching && !!saleId,
  });
}

export function useGenerateSaleBill(saleId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SaleBill | null>({
    queryKey: ['saleBill', saleId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.generateSaleBill(saleId);
    },
    enabled: !!actor && !isFetching && !!saleId,
  });
}
