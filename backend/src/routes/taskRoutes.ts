/**
 * @openapi
 * /api/tasks/{id}/validate:
 * patch:
 * summary: Validation hiérarchique d'une tâche
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID de la tâche à valider
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * approved:
 * type: boolean
 * comment:
 * type: string
 * responses:
 * 200:
 * description: Décision enregistrée avec succès
 * 403:
 * description: Droits insuffisants (Chef de département requis)
 */
router.patch('/:id/validate', validateTask);