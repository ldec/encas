var transactionModel = {
    transactions: ko.observableArray(),
    show_revoke: ko.observable(true),
    show_all : true,

    getTransactions: function(account_id) {
		function refresh(data) {
			if (reportError(data)) {
				return;
			}

			var data = data.data;

			for (var i=0; i < data.length; i++) {
				data[i].date = formatDate(new Date(data[i].date));

				if (data[i].balance < -10) {
					data[i]['state'] = "danger";
				}
				else {
					if (data[i].balance <= 0) {
						data[i]['state'] = "warning";
					}
					else {
						data[i]['state'] = "success";
					}
				}
			}

			transactionModel.transactions(data);
		}

		api.transaction.listByAccount(refresh.bind(transactionModel), account_id, transactionModel.show_all);
	},

    clear : function() {
        transactionModel.transactions.removeAll();
    },

    revoke : function(target) {
        var transaction_id = target.id;

        function refresh(data) {
            if (reportError(data)) {
                return;
            }
            var data = data.data;

            reportSuccess("L'opération " + data.operation + " a été révoquée.");

            transactionModel.getTransactions(current.account_id);
        }

        api.transaction.revoke(refresh, transaction_id);
    }
};