import api from "./client";

/**
 * DashboardAPI — statistiques et gestion des commandes.
 *
 * GET   /shop/dashboard/                          ?period&start_date&end_date
 * GET   /shop/dashboard/orders/                   ?status&search&ordering&page  ← nouveau en v2
 * PATCH /shop/dashboard/orders/:id/status/        ← nouveau en v2
 * GET   /shop/dashboard/orders/:id/invoice/       ← nouveau en v2
 * GET   /shop/dashboard/orders/client/:id/history/ ← nouveau en v2
 */
class DashboardAPI {
  /**
   * Statistiques globales du dashboard.
   * @param {{
   *   period?     : 'today' | 'week' | 'month' | 'year',
   *   start_date? : string,  // format: 'DD-MM-YYYY'
   *   end_date?   : string,  // format: 'DD-MM-YYYY'
   * }} params
   */
  getStats(params = {}) {
    return api.get("/shop/dashboard/", { params });
  }

  /**
   * Liste des commandes avec filtres et pagination.
   * ⚠️  Nouveau en v2
   * @param {{
   *   status?   : string,  // ex: 'pending', 'delivered', 'in_progress'
   *   search?   : string,
   *   ordering? : string,  // ex: '-created_at'
   *   page?     : number,
   * }} params
   */
  listOrders(params = {}) {
    return api.get("/shop/dashboard/orders/", { params });
  }

  /**
   * Met à jour le statut d'une commande.
   * ⚠️  Nouveau en v2
   * @param {string} id     — UUID de la commande
   * @param {string} status — ex: 'delivered', 'cancelled'
   */
  updateOrderStatus(id, status) {
    return api.patch(`/shop/dashboard/orders/${id}/status/`, { status });
  }

  /**
   * Récupère la facture d'une commande (données ou PDF).
   * ⚠️  Nouveau en v2
   * @param {string} id — UUID
   */
  getOrderInvoice(id) {
    return api.get(`/shop/dashboard/orders/${id}/invoice/`);
  }

  /**
   * Historique des commandes d'un client.
   * ⚠️  Nouveau en v2
   * @param {string} clientId — UUID du client
   */
  getClientOrderHistory(clientId) {
    return api.get(`/shop/dashboard/orders/client/${clientId}/history/`);
  }
}

export const dashboardAPI = new DashboardAPI();
