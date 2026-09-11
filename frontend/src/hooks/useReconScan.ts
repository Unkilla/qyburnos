import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockReconApi, type ReconApi } from '../api/reconApi'
import type { Scan, StartScanInput } from '../types/recon'

export const useReconScan = (api: ReconApi = mockReconApi) => {
  const queryClient = useQueryClient()
  const scanQuery = useQuery<Scan>({ queryKey: ['active-scan'], queryFn: api.getActiveScan, refetchInterval: (query) => query.state.data?.status === 'complete' ? false : 2200 })
  const startScan = useMutation({ mutationFn: (input: StartScanInput) => api.startScan(input), onSuccess: (scan) => queryClient.setQueryData(['active-scan'], scan) })
  return { scan: scanQuery.data, isLoading: scanQuery.isLoading, isStarting: startScan.isPending, startScan: startScan.mutate }
}