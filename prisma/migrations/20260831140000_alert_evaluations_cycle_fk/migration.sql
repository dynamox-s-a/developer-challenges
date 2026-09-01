-- AddForeignKey
ALTER TABLE "alert_rule_evaluations" ADD CONSTRAINT "alert_rule_evaluations_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "ingestion_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Ledger de avaliações passa a acompanhar o ciclo: apagar um ciclo (rota de exclusão de
-- série, limpeza de fixtures) leva junto as suas avaliações — uma avaliação de ciclo que não
-- existe mais não significa nada. Aditiva: só cria a constraint na tabela nova.
