/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.kie.kogito.trusty.storage.postgresql;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.kie.kogito.persistence.postgresql.model.CacheEntityRepository;
import org.kie.kogito.trusty.storage.api.model.DMNModelWithMetadata;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.kie.kogito.trusty.storage.common.TrustyStorageService.MODELS_STORAGE;

@ApplicationScoped
public class DMNModelWithMetadataStorage extends BaseTransactionalStorage<DMNModelWithMetadata> {

    DMNModelWithMetadataStorage() {
        //CDI proxy
    }

    @Inject
    public DMNModelWithMetadataStorage(CacheEntityRepository repository, ObjectMapper mapper) {
        super(MODELS_STORAGE, repository, mapper, DMNModelWithMetadata.class);
    }
}
